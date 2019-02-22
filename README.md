<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [cls-proxify \*](#cls-proxify-)
  - [Installation](#installation)
  - [Quick start](#quick-start)
    - [Express](#express)
    - [Koa](#koa)
    - [Fastify](#fastify)
    - [Any other framework or library](#any-other-framework-or-library)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# cls-proxify [![Build Status](https://travis-ci.org/keenondrums/cls-proxify.svg?branch=master)](https://travis-ci.org/keenondrums/cls-proxify)

A small library that proxies any arbitrary object with a proxy from [CLS](https://github.com/jeff-lewis/cls-hooked) if found one. Super-useful for creating child loggers per each request with dynamic context from the request itself (e.g., adding request trace ID, adding request payload). Integrated with [express](https://github.com/expressjs/express), [koa](https://github.com/koajs/koa), [fastify](https://github.com/fastify/fastify) out-of-the-box.

Many thanks to [@mcollina](https://github.com/mcollina) for the idea of combining [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and [CLS](https://github.com/jeff-lewis/cls-hooked).

## Installation

```
npm i cls-proxify
```

## Quick start

### Express

> TypeScript users, `clsProxifyExpressMiddleware` uses typings from `@types/express`. Please, run `npm i -D @types/express`

```ts
import { clsProxify } from 'cls-proxify'
import { clsProxifyExpressMiddleware } from 'cls-proxify/integration/express'
import * as express from 'express'

const logger = clsProxify('clsKeyLogger', {
  info: (msg: string) => console.log(msg),
})

const app = express()
app.use(
  clsProxifyExpressMiddleware('clsKeyLogger', (req) => {
    const headerRequestID = req.headers.Traceparent
    const loggerProxy = {
      info: (msg: string) => `${headerRequestID}: ${msg}`,
    }
    // this value will be accesible in CLS by key 'clsKeyLogger'
    // it will be used as a proxy for `logger`
    return loggerProxy
  }),
)

app.get('/test', (req, res) => {
  logger.info('My message!')
  // Logs `${headerRequestID}: My message!` into the console
  // Say, we send GET /test with header 'Traceparent' set to 12345
  // It's going to log '12345: My message!'
  // If it doesn't find anything in CLS by key 'clsKeyLogger' it uses the original logger and logs 'My message!'
})
```

### Koa

> TypeScript users, `clsProxifyKoaMiddleware` uses typings from `@types/koa`. Please, run `npm i -D @types/koa`

```ts
import { clsProxify } from 'cls-proxify'
import { clsProxifyKoaMiddleware } from 'cls-proxify/integration/koa'
import * as Koa from 'koa'

const logger = clsProxify('clsKeyLogger', {
  info: (msg: string) => console.log(msg),
})

const app = new Koa()
app.use(
  clsProxifyKoaMiddleware('clsKeyLogger', (ctx) => {
    const headerRequestID = ctx.req.headers.Traceparent
    const loggerProxy = {
      info: (msg: string) => `${headerRequestID}: ${msg}`,
    }
    // this value will be accesible in CLS by key 'clsKeyLogger'
    // it will be used as a proxy for `logger`
    return loggerProxy
  }),
)

app.use((ctx) => {
  logger.info('My message!')
  // Logs `${headerRequestID}: My message!` into the console
  // Say, we send GET / with header 'Traceparent' set to 12345
  // It's going to log '12345: My message!'
  // If it doesn't find anything in CLS by key 'clsKeyLogger' it uses the original logger and logs 'My message!'
})
```

### Fastify

```ts
import { clsProxify } from 'cls-proxify'
import { clsProxifyFastifyMiddleware } from 'cls-proxify/integration/fastify'
import * as fastify from 'fastify'

const logger = clsProxify('clsKeyLogger', {
  info: (msg: string) => console.log(msg),
})

const app = fastify()
app.use(
  clsProxifyFastifyMiddleware('clsKeyLogger', (req) => {
    const headerRequestID = ctx.req.headers.Traceparent
    const loggerProxy = {
      info: (msg: string) => `${headerRequestID}: ${msg}`,
    }
    // this value will be accesible in CLS by key 'clsKeyLogger'
    // it will be used as a proxy for `logger`
    return loggerProxy
  }),
)

app.get('/test', (req, res) => {
  logger.info('My message!')
  // Logs `${headerRequestID}: My message!` into the console
  // Say, we send GET /test with header 'Traceparent' set to 12345
  // It's going to log '12345: My message!'
  // If it doesn't find anything in CLS by key 'clsKeyLogger' it uses the original logger and logs 'My message!'
})
```

### Any other framework or library

```ts
import { clsProxify, clsProxifyNamespace } from 'cls-proxify'
import { clsProxifyFastifyMiddleware } from 'cls-proxify/integration/fastify'
import AbstractWebServer from 'abstract-web-server'

const logger = clsProxify('clsKeyLogger', {
  info: (msg: string) => console.log(msg),
})

const app = new AbstractWebServer()
// Assuming this AbstractWebServer supports some form of middlewares
app.use((request, response, next) => {
  clsProxifyNamespace.run(() => {
    const headerRequestID = request.headers.Traceparent
    // this value will be accesible in CLS by key 'clsKeyLogger'
    // it will be used as a proxy for `logger`
    const loggerProxy = {
      info: (msg: string) => `${headerRequestID}: ${msg}`,
    }
    setClsProxyValue('clsKeyLogger', loggerProxy)

    next()
  })
})

app.get('/test', (req, res) => {
  logger.info('My message!')
  // Logs `${headerRequestID}: My message!` into the console
  // Say, we send GET /test with header 'Traceparent' set to 12345
  // It's going to log '12345: My message!'
  // If it doesn't find anything in CLS by key 'clsKeyLogger' it uses the original logger and logs 'My message!'
})
```
