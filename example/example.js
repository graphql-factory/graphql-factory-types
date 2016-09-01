import * as graphql from 'graphql'
import GraphQLFactory from 'graphql-factory'
import FactoryTypes from '../index'

let data = [
  { timestamp: new Date(), message: 'Message1', json: { key: 'value1' } },
  { timestamp: new Date(), message: 'Message2', json: { key: [ 'value2', 1 ] }  }
]

let types = {
  Log: {
    fields: {
      timestamp: 'FactoryDateTime',
      message: 'String',
      json: 'FactoryJSON'
    }
  },
  LogQuery: {
    fields: {
      getLogs: {
        type: ['Log'],
        resolve () {
          return data
        }
      }
    }
  }
}

let schemas = {
  Log: {
    query: 'LogQuery'
  }
}

let factory = GraphQLFactory(graphql)
let lib = factory.make({ types, schemas }, { plugin: FactoryTypes })

lib.Log(`{ getLogs { timestamp, message, json } }`)
  .then((res) => {
    console.log(JSON.stringify(res, null, '  '))
  })
  .catch((err) => {
    console.error('ERROR:', err)
  })