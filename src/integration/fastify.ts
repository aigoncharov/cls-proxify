import { EventEmitter } from 'events'
import { IncomingMessage, ServerResponse } from 'http'

import { clsProxifyNamespace, setClsProxyValue } from '../core'

export type CreateClsProxyFastify<HttpRequest, HttpResponse> = (req: HttpRequest, response: HttpResponse) => any
export const clsProxifyFastifyMiddleware = <
  HttpRequest extends EventEmitter = IncomingMessage,
  HttpResponse extends EventEmitter = ServerResponse
>(
  clsKey: string,
  createClsProxy: CreateClsProxyFastify<HttpRequest, HttpResponse>,
) => (req: HttpRequest, res: HttpResponse, next: (err?: Error) => void) => {
  clsProxifyNamespace.bindEmitter(req)
  clsProxifyNamespace.bindEmitter(res)

  clsProxifyNamespace.run(() => {
    const proxyValue = createClsProxy(req, res)
    setClsProxyValue(clsKey, proxyValue)

    next()
  })
}
