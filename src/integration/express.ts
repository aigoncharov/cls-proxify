import { Request, RequestHandler, Response } from 'express'

import { clsNamespace, setClsProxyValue } from '../core'

export type CreateClsProxyExpress = (req: Request, response: Response) => any
export const clsProxifyExpressMiddleware = (clsKey: string, createClsProxy: CreateClsProxyExpress): RequestHandler => (
  req,
  res,
  next,
) => {
  clsNamespace.bindEmitter(req)
  clsNamespace.bindEmitter(res)

  clsNamespace.run(() => {
    const proxyValue = createClsProxy(req, res)
    setClsProxyValue(clsKey, proxyValue)

    next()
  })
}
