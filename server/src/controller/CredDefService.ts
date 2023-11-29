import type { CredDef, Schema } from 'indy-sdk'

import { Agent, IndySdkError } from '@aries-framework/core'
import { isIndyError } from '@aries-framework/core/build/utils/indyError.js'
import { Inject, Service } from 'typedi'

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
    const publicDid = this.agent.publicDid?.did
    if (!publicDid) {
      throw new Error('Public DID not found')
    }

    const schemaId = `${publicDid}:2:${options.schema.name}:${options.schema.version}`

    let schema: Schema

    try {
      schema = await this.agent.ledger.getSchema(schemaId)
      this.agent.config.logger.info(`Schema ${schema.id} already exists`)
    } catch (error) {
      if (error instanceof IndySdkError && isIndyError(error.cause, 'LedgerNotFound')) {
        this.agent.config.logger.info(`Schema ${schemaId} does not exist yet, creating it...`)
        schema = await this.agent.ledger.registerSchema({
          attributes: options.schema.attributeNames,
          name: options.schema.name,
          version: options.schema.version,
        })
      } else {
        this.agent.config.logger.info(`Error fetching ${schemaId}`)
        throw error
      }
    }

    return await this.agent.ledger.registerCredentialDefinition({
      schema,
      supportRevocation: options.credentialDefinition.supportRevocation,
      tag: options.credentialDefinition.tag,
    })
  }
}
