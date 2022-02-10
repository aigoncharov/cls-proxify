import 'cls-hooked'
import { getClsHookedStorage, setClsHookedStorage, ClsHookedStorage } from './cls'

describe('ClsHookedStorage', () => {
  test('sets a value in cls and gets it back', () => {
    const testVal = {
      prop: Symbol(),
    }
    getClsHookedStorage().namespace.run(() => {
      getClsHookedStorage().set(testVal)
      const clsVal = getClsHookedStorage().get()
      expect(clsVal).toBe(testVal)
    })
  })
  test('throws if no cls context found', () => {
    const testVal = {
      prop: Symbol(),
    }
    expect(() => getClsHookedStorage().set(testVal)).toThrow()
  })
  test('sets custom ClsHookedStorage', () => {
    const defaultStorage = getClsHookedStorage()
    const newStorage = new ClsHookedStorage()
    setClsHookedStorage(newStorage)
    expect(getClsHookedStorage()).toBe(newStorage)
    expect(getClsHookedStorage()).not.toBe(defaultStorage)
  })
})
