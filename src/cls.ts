import { createNamespace } from 'cls-hooked'

export interface ClsProxifyStorage<T> {
  set(proxy: T): void
  get(): T | undefined
}

export class ClsHookedStorage<T = unknown> implements ClsProxifyStorage<T> {
  public readonly namespace = createNamespace('clsProxifyNamespace')
  protected readonly key = 'cls-proxify'

  set(proxy: T) {
    this.namespace.set(this.key, proxy)
  }

  get() {
    return this.namespace.get(this.key)
  }
}

let clsHookedStorage = new ClsHookedStorage()

export const setClsHookedStorage = (newClsHookedStorage: ClsHookedStorage) => {
  clsHookedStorage = newClsHookedStorage
}

export const getClsHookedStorage = () => clsHookedStorage
