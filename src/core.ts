import { getClsHookedStorage } from './cls'

export const clsProxify = <T extends object>(targetToProxify: T) => {
  const proxified = new Proxy(targetToProxify, {
    get(target, property, receiver) {
      target = getClsHookedStorage().get() || target
      return Reflect.get(target, property, receiver)
    },
    apply(target, thisArg, args) {
      target = getClsHookedStorage().get() || target
      return Reflect.apply(target as () => any, thisArg, args)
    },
    construct(target, args) {
      target = getClsHookedStorage().get() || target
      return Reflect.construct(target as new () => any, args)
    },
    has(target, key) {
      target = getClsHookedStorage().get() || target
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      target = getClsHookedStorage().get() || target
      return Reflect.ownKeys(target)
    },
    getOwnPropertyDescriptor(target, key) {
      target = getClsHookedStorage().get() || target
      return Reflect.getOwnPropertyDescriptor(target, key)
    },
  })
  return proxified
}
