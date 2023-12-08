import type { CredDef, Schema } from 'indy-sdk'

import { Agent, CredentialExchangeRecord, CredentialPreviewAttribute } from '@aries-framework/core'
import { Inject, Service } from 'typedi'

type CredentialExchangeRecordWithAttributes = CredentialExchangeRecord & {
  credentialAttributes?: CredentialPreviewAttribute[];
};

@Service()
export class CredDefService {
  @Inject()
  private agent: Agent
  private credentialDefinitions: CredDef[] = []

  public constructor(agent: Agent) {
    this.agent = agent
    this.init()
  }

  public getCredentialDefinitionIdByTag(tag: string) {
    const def = this.credentialDefinitions.find((x) => x.tag === tag)

    if (!def) {
      throw new Error(`CredentialDefinition not found for ${tag}`)
    }

    return def.id
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
        name: 'marks-card',
        version: '1.1',
      },
      credentialDefinition: {
        supportRevocation: false,
        tag: 'university-marks-card',
      },
    })
    this.credentialDefinitions = await Promise.all([cd1])
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
    const publicDid = this.agent.dids
    if (!publicDid) {
      throw new Error('Public DID not found')
    }

    const schemaId = `${publicDid}:2:${options.schema.name}:${options.schema.version}`

    let schema: Schema

    try {
     
        this.agent.config.logger.info(`Schema ${schemaId} does not exist yet, creating it...`)
        schema = await this.agent.modules.anoncreds.registerSchema({
          attributes: options.schema.attributeNames,
          name: options.schema.name,
          version: options.schema.version,
        })
      }catch (e){
        console.log(e)
      }
    

    return await this.agent.modules.anoncreds.registerCredentialDefinition({
      schema,
      supportRevocation: options.credentialDefinition.supportRevocation,
      tag: options.credentialDefinition.tag,
    })
  }
}
