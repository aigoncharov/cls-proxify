import 'cls-hooked'
import { getClsHookedStorage } from './cls'

import { clsProxify } from './core'

describe('clsProxify', () => {
  describe('get', () => {
    interface ITestObj {
      prop: symbol
    }
    let original!: ITestObj
    let proxy!: ITestObj
    let proxified!: ITestObj
    beforeEach(() => {
      original = {
        prop: Symbol(),
      }
      proxy = {
        prop: Symbol(),
      }
      proxified = clsProxify(original)
    })

    test('uses value from cls', () => {
      getClsHookedStorage().namespace.run(() => {
        getClsHookedStorage().set(proxy)
        expect(proxified.prop).toBe(proxy.prop)
      })
    })
    test('falls back to original', () => {
      getClsHookedStorage().namespace.run(() => {
        expect(proxified.prop).toBe(original.prop)
      })
    })
  })

  describe('apply', () => {
    type TestFn = () => number
    let original!: TestFn
    let proxy!: TestFn
    let proxified!: TestFn
    beforeEach(() => {
      original = () => 10
      proxy = () => 20
      proxified = clsProxify(original)
    })

    test('uses value from cls', () => {
      getClsHookedStorage().namespace.run(() => {
        getClsHookedStorage().set(proxy)
        expect(proxified()).toBe(proxy())
      })
    })
    test('falls back to original', () => {
      getClsHookedStorage().namespace.run(() => {
        expect(proxified()).toBe(original())
      })
    })
  })

  // tslint:disable max-classes-per-file
  describe('construct', () => {
    type TestClass = new () => object
    let original!: TestClass
    let proxy!: TestClass
    let proxified!: TestClass
    beforeEach(() => {
      original = class {}
      proxy = class {}
      proxified = clsProxify(original)
    })

    test('uses value from cls', () => {
      getClsHookedStorage().namespace.run(() => {
        getClsHookedStorage().set(proxy)
        expect(new proxified()).toBeInstanceOf(proxy)
        expect(new proxified()).not.toBeInstanceOf(original)
      })
    })
    test('falls back to original', () => {
      getClsHookedStorage().namespace.run(() => {
        expect(new proxified()).toBeInstanceOf(original)
        expect(new proxified()).not.toBeInstanceOf(proxy)
      })
    })
  })

  describe('has', () => {
    const objKey1 = 'objKey1'
    const objKey2 = 'objKey2'
    let original!: any
    let proxy!: any
    let proxified!: any
    beforeEach(() => {
      original = {
        [objKey1]: Symbol(),
      }
      proxy = {
        [objKey2]: Symbol(),
      }
      proxified = clsProxify(original)
    })

    test('uses value from cls', () => {
      getClsHookedStorage().namespace.run(() => {
        getClsHookedStorage().set(proxy)
        expect(objKey2 in proxified).toBeTruthy()
        expect(objKey1 in proxified).toBeFalsy()
      })
    })
    test('falls back to original', () => {
      getClsHookedStorage().namespace.run(() => {
        expect(objKey1 in proxified).toBeTruthy()
        expect(objKey2 in proxified).toBeFalsy()
      })
    })
  })

  describe('ownKeys', () => {
    let original!: any
    let proxy!: any
    let proxified!: any
    beforeEach(() => {
      original = {
        objKey1: Symbol(),
        objKey2: Symbol(),
      }
      proxy = {
        objKey2: Symbol(),
        objKey3: Symbol(),
        objKey4: Symbol(),
      }
      proxified = clsProxify(original)
    })

    test('uses value from cls', () => {
      getClsHookedStorage().namespace.run(() => {
        getClsHookedStorage().set(proxy)
        expect(Object.keys(proxified)).toEqual(Object.keys(proxy))
        expect(Object.keys(proxified).length).toBe(3)
      })
    })
    test('falls back to original', () => {
      getClsHookedStorage().namespace.run(() => {
        expect(Object.keys(proxified)).toEqual(Object.keys(original))
        expect(Object.keys(proxified).length).toBe(2)
      })
    })
  })
})
