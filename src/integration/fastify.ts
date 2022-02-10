import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import { name } from '../../package.json'

import { getClsHookedStorage } from '../cls'

export type CreateClsProxyFastify = (req: FastifyRequest, reply: FastifyReply) => any

export const clsProxifyFastifyPlugin: FastifyPluginCallback<{ proxify: CreateClsProxyFastify }> = (
  fastify,
  { proxify },
  next,
) => {
  fastify.addHook('onRequest', (request, reply, done) => {
    getClsHookedStorage().namespace.bindEmitter(request.raw)
    getClsHookedStorage().namespace.bindEmitter(reply.raw)

    getClsHookedStorage().namespace.run(() => {
      const proxyValue = proxify(request, reply)
      getClsHookedStorage().set(proxyValue)

      done()
    })
  })
  next()
}
;(clsProxifyFastifyPlugin as any)[Symbol.for('skip-override')] = true
;(clsProxifyFastifyPlugin as any)[Symbol.for('fastify.display-name')] = name
