const { ApolloServer,PubSub, gql } = require('apollo-server')
const mongoose = require('mongoose')

// Models
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config.js')

const pubsub = new PubSub()

// Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
})

// Data Base
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDb connected for now')
        return server.listen({ port: 5000 })
    })
    .then(response => {
        console.log(`Server up and running at: ${response.url}`)
    })
    .catch(err => {
        console.error(err)
      })