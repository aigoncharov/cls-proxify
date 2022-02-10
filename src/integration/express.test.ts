import express from 'express'
import request from 'supertest'

import { clsProxify } from '../core'
import { clsProxifyExpressMiddleware } from './express'

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
    const app = express()
    app.use(clsProxifyExpressMiddleware(() => clsProxy))
    app.get(route, (req, res) => res.json(proxified.prop))

    const { body } = await request(app).get(route)
    expect(body).toBe(clsProxy.prop)
  })
})
