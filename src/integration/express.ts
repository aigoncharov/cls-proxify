import { Request, RequestHandler, Response } from 'express'

import { getClsHookedStorage } from '../cls'

export type CreateClsProxyExpress = (req: Request, response: Response) => any
export const clsProxifyExpressMiddleware = (createClsProxy: CreateClsProxyExpress): RequestHandler => (
  req,
  res,
  next,
) => {
  getClsHookedStorage().namespace.bindEmitter(req)
  getClsHookedStorage().namespace.bindEmitter(res)

  getClsHookedStorage().namespace.run(() => {
    const proxyValue = createClsProxy(req, res)
    getClsHookedStorage().set(proxyValue)

    next()
  })
}
