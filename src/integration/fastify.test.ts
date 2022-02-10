import fastify from 'fastify'

import { clsProxify } from '../core'
import { clsProxifyFastifyPlugin } from './fastify'

describe('clsProxifyExpressMiddleware', () => {
  test('creates a proxy', async () => {
    const original = {
      prop: 123,
    }
    const proxified = clsProxify(original)

    const clsProxy: typeof original = {
      prop: 234,
    }
    const route = '/test'
    const app = fastify()
    app.register(clsProxifyFastifyPlugin, { proxify: () => clsProxy })
    app.get(route, (req, res) => {
      res.send(proxified.prop)
    })

    const { payload } = await app.inject({
      method: 'GET',
      url: route,
    })
    const payloadJson = JSON.parse(payload)
    expect(payloadJson).toBe(clsProxy.prop)
  })
})
