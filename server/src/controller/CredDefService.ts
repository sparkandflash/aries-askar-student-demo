import type { CredDef } from 'indy-sdk'

import { Agent, CredentialExchangeRecord, CredentialPreviewAttribute, DidCreateOptions, KeyType, TypedArrayEncoder, utils } from '@aries-framework/core'
import { Inject, Service } from 'typedi'
import { indyNetworkConfig } from '../utils/baseAgent.js';
import { AnonCredsCredentialDefinition, RegisterCredentialDefinitionReturnStateFinished } from '@aries-framework/anoncreds';

type CredentialExchangeRecordWithAttributes = CredentialExchangeRecord & {
  credentialAttributes?: CredentialPreviewAttribute[];
};

@Service()
export class CredDefService {
  @Inject()
  private agent: Agent
  private credentialDefinitions: RegisterCredentialDefinitionReturnStateFinished[] = []
  public anonCredsIssuerId?: string
  public credentialDefinition?: RegisterCredentialDefinitionReturnStateFinished
  public constructor(agent: Agent) {
    this.agent = agent
    this.init()

  }
  public async importDid() {
    // NOTE: we assume the did is already registered on the ledger, we just store the private key in the wallet
    // and store the existing did in the wallet
    // indy did is based on private key (seed)
    const unqualifiedIndyDid = '2jEvRuKmfBJTRa7QowDpNN'
    const indyDid = `did:indy:${indyNetworkConfig.indyNamespace}:${unqualifiedIndyDid}`

    const did = indyDid
    await this.agent.dids.import({
      did,
      overwrite: true,
      privateKeys: [
        {
          keyType: KeyType.Ed25519,
          privateKey: TypedArrayEncoder.fromString('afjdemoverysercure00000000000000'),
        },
      ],
    })
    this.anonCredsIssuerId = did
    return did
  }

  public getCredentialDefinitionIdByTag(tag: string) {
    const def = this.credentialDefinitions.find((x) => x.credentialDefinition.tag === tag)

    if (!def) {
      throw new Error(`CredentialDefinition not found for ${tag}`)
    }

    return def.credentialDefinitionId
  }

  // FIXME: this will break if called concurrently. We need to do this in setup, and agent can't be used until it is done.
  public async getAll() {
    if (this.credentialDefinitions.length === 0) {
      await this.init()
    }
    return this.credentialDefinitions
  }

  public async getAllCredentialsByConnectionId(connectionId: string) {
    const credentials = await this.agent.credentials.getAll()
    const filtered = credentials.filter((cred) => cred.connectionId === connectionId)

    return filtered.map((c) => c.toJSON())
  }


  public async getAllCredentialsByAttribute(value: string): Promise<CredentialExchangeRecordWithAttributes[]> {
    const credentialExchangeRecords = await this.agent.credentials.getAll();

    // Filter credentialExchangeRecords based on the specified value
    const filteredCredentialExchangeRecords = credentialExchangeRecords.filter(
      (credRecord: CredentialExchangeRecordWithAttributes) => {
        // Check if credRecord and credRecord.credentialAttributes are defined before accessing values
        const attributes = credRecord?.credentialAttributes;

        // Check if attributes is an array and contains the specified value
        return Array.isArray(attributes) && attributes.some((attr) => attr.name === value || attr.value === value);
      }
    );

    return filteredCredentialExchangeRecords;
  }

  // TODO: these should be auto-created based on the use cases.
  private async init() {

    const cd1 = await this.createSchemaCredentialDefinition({
      schema: {
        attributeNames: ['id', 'name', 'course', 'year', 'mark'],
        name: 'marks-card' + utils.uuid(),
        version: '1.1',
      },
      credentialDefinition: {
        supportRevocation: false,
        tag: 'university-marks-card',
      },
    })
    if (cd1 != undefined) {
      this.credentialDefinitions = await Promise.all([cd1])
    }
  }

  private async createSchemaCredentialDefinition(options: {
    schema: {
      attributeNames: string[]
      name: string
      version: string
    }
    credentialDefinition: {
      tag: string
      supportRevocation: boolean
    }
  }) {
    let did = this.importDid()
    if (await did) {
      try {
        const schemaResult = await this.agent.modules.anoncreds.registerSchema({
          schema: {
            attrNames: options.schema.attributeNames,
            issuerId: this.anonCredsIssuerId,
            name: options.schema.name,
            version: options.schema.version,
          },
          options: {},
        });

        if (schemaResult.schemaState.state === 'failed') {
          throw new Error(`Error creating schema: ${schemaResult.schemaState.reason}`);
        }

        const { credentialDefinitionState } = await this.agent.modules.anoncreds.registerCredentialDefinition({
          credentialDefinition: {
            tag: options.credentialDefinition.tag,
            issuerId: this.anonCredsIssuerId,
            schemaId: schemaResult.schemaState.schemaId,
          },
          options: {
            endorserMode: 'internal',
            endorserDid: this.anonCredsIssuerId,
          },
        });

        if (credentialDefinitionState.state === 'failed') {
          throw new Error(`Error creating credential definition: ${credentialDefinitionState.reason}`);
        }
        this.credentialDefinition = credentialDefinitionState
        return this.credentialDefinition;
      } catch (e) {
        console.error(e);
        // Handle the error further if needed
        throw e;
      }
    }
  }
}
