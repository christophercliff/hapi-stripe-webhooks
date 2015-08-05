# hapi-stripe-webhooks

test

[![Build Status](https://circleci.com/gh/christophercliff/hapi-stripe-webhooks.svg?style=shield)](https://circleci.com/gh/christophercliff/hapi-stripe-webhooks) [![Coverage Status](https://coveralls.io/repos/christophercliff/hapi-stripe-webhooks/badge.svg?branch=master&service=github)](https://coveralls.io/github/christophercliff/hapi-stripe-webhooks?branch=master)

A [Hapi](http://hapijs.com/) plugin for receiving notifications from the [Stripe webhooks API](https://stripe.com/docs/webhooks).

## Installation

```
npm install hapi-stripe-webhooks
```

## Usage

```js
var StripeWebhooks = require('hapi-stripe-webhooks')

server.register({
  register: StripeWebhooks,
  options: options,
})
```

### **`options`** `Object`

- **`onNotification`** `Function`

    The callback to be invoked when a notification is received. The function has the signature `function (payload) {}`. Required.

- **`path`** `String`

    The path to listen on. Default `'/'`.

- **`stripeSecretKey`** `String`

    The [Stripe secret key](https://support.stripe.com/questions/where-do-i-find-my-api-keys). Required.

## Tests

```
$ npm test
```

## License

See [LICENSE](https://github.com/christophercliff/hapi-stripe-webhooks/blob/master/LICENSE.md).
