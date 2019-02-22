import { Request, RequestHandler, Response } from 'express'

import { clsProxifyNamespace, setClsProxyValue } from '../core'

export type CreateClsProxyExpress = (req: Request, response: Response) => any
export const clsProxifyExpressMiddleware = (clsKey: string, createClsProxy: CreateClsProxyExpress): RequestHandler => (
  req,
  res,
  next,
) => {
  clsProxifyNamespace.bindEmitter(req)
  clsProxifyNamespace.bindEmitter(res)

  clsProxifyNamespace.run(() => {
    const proxyValue = createClsProxy(req, res)
    setClsProxyValue(clsKey, proxyValue)

    next()
  })
}
