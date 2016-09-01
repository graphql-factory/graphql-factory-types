# graphql-factory-types
Custom types plugin for graphql-factory

### Custom Types
* `FactoryDateTime`
* `FactoryJSON`

### Example
Create a simple type and schema in `graphql-factory` and execute a query

```js
import * as graphql from 'graphql'
import GraphQLFactory from 'graphql-factory'
import FactoryTypes from 'graphql-factory-types'
let factory = GraphQLFactory(graphql)

let functions = {
  getLog (source, args, context, info) {
    return [
      { timestamp: new Date(), message: 'Message1', info: { key: 1 } },
      { timestamp: new Date(), message: 'Message2', info: { key: 2 } }
    ]
  }
}

let types = {
  Log: {
    fields: {
      timestamp: { type: 'FactoryDateTime' },
      message: { type: 'String' },
      info: { type: 'FactoryJSON' }
    }
  },
  LogQuery: {
    fields: {
      getLog: {
        type: ['Log'],
        resolve: 'getLog'
      }
    }
  }
}
let schemas = {
  Log: {
    query: 'LogQuery'
  }
}

let lib = factory.make({
  functions,
  types,
  schemas
}, {
  plugin: FactoryTypes
})

lib.Log('{ getLog { timestamp, message, info } }')
  .then(console.log)

```

#### Credits
The following types were ported to graphql-factory format but all credit goes to the original developers.

* `FactoryDateTime` ported from [`graphql-custom-datetype`](https://github.com/soundtrackyourbrand/graphql-custom-datetype)
* `FactoryJSON` ported from [`graphql-type-json`](https://github.com/taion/graphql-type-json)
