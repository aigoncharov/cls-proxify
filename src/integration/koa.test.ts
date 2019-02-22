import * as Koa from 'koa'
import * as request from 'supertest'

import { clsProxify } from '../core'
import { clsProxifyKoaMiddleware } from './koa'

describe('clsProxifyKoaMiddleware', () => {
  test('creates a proxy', async () => {
    const clsKey = 'myProxy'
    const original = {
      prop: 123,
    }
    const proxified = clsProxify(clsKey, original)

    const clsProxy: typeof original = {
      prop: 234,
    }
    const app = new Koa()
    app.use(clsProxifyKoaMiddleware(clsKey, () => clsProxy))
    app.use((ctx) => {
      ctx.body = proxified.prop
    })

    const { body } = await request(app.callback()).get('/')
    expect(body).toBe(clsProxy.prop)
  })
})
