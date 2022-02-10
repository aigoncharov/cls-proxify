import Koa from 'koa'
import request from 'supertest'

import { clsProxify } from '../core'
import { clsProxifyKoaMiddleware } from './koa'

describe('clsProxifyKoaMiddleware', () => {
  test('creates a proxy', async () => {
    const original = {
      prop: 123,
    }
    const proxified = clsProxify(original)

    const clsProxy: typeof original = {
      prop: 234,
    }
    const app = new Koa()
    app.use(clsProxifyKoaMiddleware(() => clsProxy))
    app.use((ctx) => {
      ctx.body = proxified.prop
    })

    const { body } = await request(app.callback()).get('/')
    expect(body).toBe(clsProxy.prop)
  })
})
