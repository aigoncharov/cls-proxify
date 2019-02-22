import { Context, Middleware } from 'koa'

import { clsNamespace, setClsProxyValue } from '../core'

export type CreateClsProxyKoa = (ctx: Context) => any
export const clsProxifyKoaMiddleware = (clsKey: string, createClsProxy: CreateClsProxyKoa): Middleware => async (
  ctx,
  next,
) => {
  clsNamespace.bindEmitter(ctx.req)
  clsNamespace.bindEmitter(ctx.res)

  await clsNamespace.runPromise(() => {
    const proxyValue = createClsProxy(ctx)
    setClsProxyValue(clsKey, proxyValue)
    return next()
  })
}
