import 'cls-hooked'

import { clsNamespace, clsProxify, getClsProxyValue, setClsProxyValue } from './core'

describe('getClsProxyValue and setClsProxyValue', () => {
  test('sets a value in cls and gets it back', () => {
    const testKey = 'test'
    const differentKey = 'test1'
    const testVal = {
      prop: Symbol(),
    }
    clsNamespace.run(() => {
      setClsProxyValue(testKey, testVal)
      const clsVal = getClsProxyValue(testKey)
      expect(clsVal).toBe(testVal)
      const invalidKeyVal = getClsProxyValue(differentKey)
      expect(invalidKeyVal).toBeUndefined()
    })
  })
  test('throws if no cls context found', () => {
    const testKey = 'test'
    const testVal = {
      prop: Symbol(),
    }
    expect(() => setClsProxyValue(testKey, testVal)).toThrow()
  })
})

describe('clsProxify', () => {
  describe('get', () => {
    const clsKey = 'test'
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
      proxified = clsProxify(clsKey, original)
    })

    test('uses value from cls', () => {
      clsNamespace.run(() => {
        setClsProxyValue(clsKey, proxy)
        expect(proxified.prop).toBe(proxy.prop)
      })
    })
    test('falls back to original', () => {
      clsNamespace.run(() => {
        expect(proxified.prop).toBe(original.prop)
      })
    })
  })

  describe('apply', () => {
    const clsKey = 'test'
    type TestFn = () => number
    let original!: TestFn
    let proxy!: TestFn
    let proxified!: TestFn
    beforeEach(() => {
      original = () => 10
      proxy = () => 20
      proxified = clsProxify(clsKey, original)
    })

    test('uses value from cls', () => {
      clsNamespace.run(() => {
        setClsProxyValue(clsKey, proxy)
        expect(proxified()).toBe(proxy())
      })
    })
    test('falls back to original', () => {
      clsNamespace.run(() => {
        expect(proxified()).toBe(original())
      })
    })
  })

  // tslint:disable max-classes-per-file
  describe('construct', () => {
    const clsKey = 'test'
    type TestClass = new () => object
    let original!: TestClass
    let proxy!: TestClass
    let proxified!: TestClass
    beforeEach(() => {
      original = class {}
      proxy = class {}
      proxified = clsProxify(clsKey, original)
    })

    test('uses value from cls', () => {
      clsNamespace.run(() => {
        setClsProxyValue(clsKey, proxy)
        expect(new proxified()).toBeInstanceOf(proxy)
        expect(new proxified()).not.toBeInstanceOf(original)
      })
    })
    test('falls back to original', () => {
      clsNamespace.run(() => {
        expect(new proxified()).toBeInstanceOf(original)
        expect(new proxified()).not.toBeInstanceOf(proxy)
      })
    })
  })

  describe('has', () => {
    const clsKey = 'test'
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
      proxified = clsProxify(clsKey, original)
    })

    test('uses value from cls', () => {
      clsNamespace.run(() => {
        setClsProxyValue(clsKey, proxy)
        expect(objKey2 in proxified).toBeTruthy()
        expect(objKey1 in proxified).toBeFalsy()
      })
    })
    test('falls back to original', () => {
      clsNamespace.run(() => {
        expect(objKey1 in proxified).toBeTruthy()
        expect(objKey2 in proxified).toBeFalsy()
      })
    })
  })

  describe('ownKeys', () => {
    const clsKey = 'test'
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
      proxified = clsProxify(clsKey, original)
    })

    test('uses value from cls', () => {
      clsNamespace.run(() => {
        setClsProxyValue(clsKey, proxy)
        expect(Object.keys(proxified)).toEqual(Object.keys(proxy))
        expect(Object.keys(proxified).length).toBe(3)
      })
    })
    test('falls back to original', () => {
      clsNamespace.run(() => {
        expect(Object.keys(proxified)).toEqual(Object.keys(original))
        expect(Object.keys(proxified).length).toBe(2)
      })
    })
  })
})
