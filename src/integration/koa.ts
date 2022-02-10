import { Context, Middleware } from 'koa'

import { getClsHookedStorage } from '../cls'

export type CreateClsProxyKoa = (ctx: Context) => any
export const clsProxifyKoaMiddleware = (createClsProxy: CreateClsProxyKoa): Middleware => async (ctx, next) => {
  getClsHookedStorage().namespace.bindEmitter(ctx.req)
  getClsHookedStorage().namespace.bindEmitter(ctx.res)

  await getClsHookedStorage().namespace.runPromise(() => {
    const proxyValue = createClsProxy(ctx)
    getClsHookedStorage().set(proxyValue)
    return next()
  })
}
