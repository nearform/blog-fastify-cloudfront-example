  'use strict'

  const users = {
    'one': { name: 'Alice', email: 'alice@email.com' },
    'two': { name: 'Bob', email: 'bob@email.com' }
  }

  async function main() {
    const fastify = require('fastify')()
    await fastify.register(require('fastify-etag'))

    fastify.get('/my-info', async (request, reply) => {
      // this "authentication" is for educational purposes only!
      const [, token] = request.headers.authorization.split(' ')
      const user = users[token.substr('user:'.length)]

      if (!user) {
        reply.code(403).send('UNAUTHORIZED')
        return
      }

      reply.type('application/json')
      reply.headers({
        'cache-control': `s-maxage=30,max-age=60`,
        vary: 'authorization'
      })

      reply.send({
        ...user,
        mobile: request.headers['cloudfront-is-mobile-viewer'],
        country: request.headers['cloudfront-viewer-country'],
        city: request.headers['cloudfront-viewer-city'],
        lat: request.headers['cloudfront-viewer-latitude'],
        lng: request.headers['cloudfront-viewer-longitude']
      })
    })

    await fastify.listen(3000 || process.env.PORT, '0.0.0.0')
  }

  main()
