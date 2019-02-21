import { createNamespace } from 'cls-hooked'

export const clsNamespaceName = 'clsProxifyNamespace'
export const clsNamespace = createNamespace(clsNamespaceName)

export const setClsProxy = <T extends object>(clsKey: string, proxy: T) => clsNamespace.set(clsKey, proxy)
export const getClsProxy = <T extends object>(clsKey: string): T | undefined => clsNamespace.get(clsKey)

export const clsProxify = <T extends object>(clsKey: string, targetToProxify: T) => {
  const proxified = new Proxy(targetToProxify as object, {
    get(target, property, receiver) {
      target = getClsProxy(clsKey) || target
      return Reflect.get(target, property, receiver)
    },
    apply(target, thisArg, args) {
      target = getClsProxy(clsKey) || target
      return Reflect.apply(target as () => any, thisArg, args)
    },
    construct(target, args) {
      target = getClsProxy(clsKey) || target
      return Reflect.construct(target as new () => any, args)
    },
    has(target, key) {
      target = getClsProxy(clsKey) || target
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      target = getClsProxy(clsKey) || target
      return Reflect.ownKeys(target)
    },
  })
  return proxified
}
