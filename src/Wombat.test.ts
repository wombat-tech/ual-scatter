import { Chain, RpcEndpoint } from 'universal-authenticator-library'
import { Name } from './interfaces'
import { Wombat } from './Wombat'

declare var window: any

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
  beforeEach(() => {
    // Fake scatter with the necessary methods
    window.scatter = {
      async connect() {}
    }
    window.open = jest.fn()
  })

  describe('shouldRender', () => {
    it('returns true in tests', async () => {
      const scatterAuth = new Wombat(chains, { appName: 'testdapp' })

      expect(scatterAuth.shouldRender()).toBe(true)
    })
  })

  describe('isLoading', () => {
    it('is false when authenticator is not initialized', () => {
      const scatterAuth = new Wombat(chains, { appName: 'testdapp' })

      expect(scatterAuth.isLoading()).toBe(false)
    })

    it('is false when authenticator is initialized', async () => {
      const scatterAuth = new Wombat([chain], { appName: 'testdapp' })
      await scatterAuth.init()

      expect(scatterAuth.isLoading()).toBe(false)
    })
  })

  describe('init errored', () => {
    it('not when no error is set', async () => {
      const scatterAuth = new Wombat([chain], { appName: 'testdapp' })
      await scatterAuth.init()

      expect(scatterAuth.isErrored()).toBe(false)
    })

    it('does not set when none exists', async () => {
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
