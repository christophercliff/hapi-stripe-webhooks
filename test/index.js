var BPromise = require('bluebird')
var expect = require('chai').expect
var Hapi = require('hapi')
var Plugin = require('../')
var nock = require('nock')
var url = require('url')
var util = require('util')
var Wreck = require('wreck')

var PORT = 8000
var URL = url.format({
    hostname: '127.0.0.1',
    pathname: '/',
    port: PORT,
    protocol: 'http',
})
var STRIPE_SECRET_KEY = 'just_a_fake_key'
var EVENT_ID = 'evt_00000000000000'

describe('the plugin', function () {

    var server = new Hapi.Server()
    var payload

    server.connection({
        port: PORT,
    })

    server.on('request-error', function (err) {
        throw err
    })

    server.register({
        register: Plugin,
        options: {
            stripeSecretKey: STRIPE_SECRET_KEY,
            onNotification: function (_payload) {
                payload = _payload
            },
        },
    }, function (err) {
        if (err) throw err
    })

    before(server.start.bind(server))
    after(server.stop.bind(server))

    beforeEach(function () {
        payload = undefined
    })

    it('should accept requests', function (done) {
        nock('https://api.stripe.com')
            .get(util.format('/v1/events/%s', EVENT_ID))
            .reply(200, {
                id: EVENT_ID,
            })
        var options = {
            payload: JSON.stringify({
                id: EVENT_ID,
            }),
        }
        new BPromise(function (resolve, reject) {
            Wreck.post(URL, options, function (err, res) {
                if (err) return reject(err)
                return resolve(res)
            })
        })
        .then(function (res) {
            expect(res.statusCode).to.equal(200)
            expect(payload).to.deep.equal({
                id: EVENT_ID,
            })
            return done()
        })
        .caught(done)
    })

})
