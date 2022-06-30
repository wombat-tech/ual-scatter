import { Chain, RpcEndpoint } from 'universal-authenticator-library'
import ScatterJS from '@scatterjs/core'
import { Name } from './interfaces'
import { Wombat } from './Wombat'

declare var window: any

jest.mock('@scatterjs/core')

const endpoint: RpcEndpoint = {
  protocol: 'https',
  host: 'example.com',
  port: 443,
}

const chain: Chain = {
  chainId: '1234567890',
  rpcEndpoints: [endpoint]
}

const chains = [chain]

describe('Wombat', () => {
  let api: any
  let scatter: any

  beforeEach(() => {
    api = {}
    scatter = {
      eos: jest.fn().mockImplementation(() => api),
      connect: jest.fn().mockImplementation(() => true),
      getIdentity: null,
    }
    window.open = jest.fn()
  })

  describe('shouldRender', () => {
    it('returns true in tests', async () => {
      ScatterJS.scatter = scatter
      const scatterAuth = new Wombat(chains, { appName: 'testdapp' })

      expect(scatterAuth.shouldRender()).toBe(true)
    })
  })

  describe('isLoading', () => {
    it('is false when authenticator is not initialized', () => {
      ScatterJS.scatter = scatter
      const scatterAuth = new Wombat(chains, { appName: 'testdapp' })

      expect(scatterAuth.isLoading()).toBe(false)
    })

    it('is false when authenticator is initialized', async () => {
      ScatterJS.scatter = scatter

      ScatterJS.scatter.connect = jest.fn().mockImplementation()
      const scatterAuth = new Wombat([chain], { appName: 'testdapp' })
      await scatterAuth.init()

      expect(scatterAuth.isLoading()).toBe(false)
    })
  })

  describe('init errored', () => {
    it('not when no error is set', async () => {
      ScatterJS.scatter = scatter
      const scatterAuth = new Wombat([chain], { appName: 'testdapp' })
      await scatterAuth.init()

      expect(scatterAuth.isErrored()).toBe(false)
    })

    it('does not set when none exists', async () => {
      ScatterJS.scatter = scatter
      const scatterAuth = new Wombat([chain], { appName: 'testdapp' })
      await scatterAuth.init()

      expect(scatterAuth.getError()).toBe(null)
    })
  })

  describe('get authenticator name', () => {
    it('should be able to get authenticator name', () => {
      const scatterAuth = new Wombat(chains, { appName: 'testdapp' })
      expect(scatterAuth.getName()).toBe(Name)
    })
  })
})
