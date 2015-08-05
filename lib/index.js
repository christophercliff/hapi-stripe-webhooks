var Boom = require('boom')
var BPromise = require('bluebird')
var createStripeClient = require('stripe')
var Joi = require('joi')
var pkg = require('../package.json')

var OPTIONS_SCHEMA = Joi.object().keys({
    onNotification: Joi.func().required(),
    path: Joi.string().default('/'),
    stripeSecretKey: Joi.string().token().required(),
}).required()

exports.register = register

register.attributes = {
    pkg: pkg,
}

function register(server, options, next) {
    var validation = Joi.validate(options, OPTIONS_SCHEMA)
    if (validation.error) return next(validation.error)
    options = validation.value
    var stripe = createStripeClient(options.stripeSecretKey)
    server.route({
        config: {
            id: 'stripe-webhooks',
            handler: function (request, reply) {
                new BPromise(function (resolve, reject) {
                    stripe.events.retrieve(request.payload.id, function (err, res) {
                        if (err) return reject(err)
                        return resolve(res)
                    })
                })
                .then(options.onNotification)
                .then(function () {
                    return reply()
                }, function (err) {
                    return reply(Boom.badImplementation())
                })
            },
        },
        method: 'POST',
        path: options.path,
    })
    return next()
}
