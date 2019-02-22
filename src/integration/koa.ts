import { Context, Middleware } from 'koa'

import { clsProxifyNamespace, setClsProxyValue } from '../core'

export type CreateClsProxyKoa = (ctx: Context) => any
export const clsProxifyKoaMiddleware = (clsKey: string, createClsProxy: CreateClsProxyKoa): Middleware => async (
  ctx,
  next,
) => {
  clsProxifyNamespace.bindEmitter(ctx.req)
  clsProxifyNamespace.bindEmitter(ctx.res)

  await clsProxifyNamespace.runPromise(() => {
    const proxyValue = createClsProxy(ctx)
    setClsProxyValue(clsKey, proxyValue)
    return next()
  })
}
