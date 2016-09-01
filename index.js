'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * Ported type from https://github.com/soundtrackyourbrand/graphql-custom-datetype
 */

function coerceDate(value) {
  if (!(value instanceof Date)) {
    // Is this how you raise a 'field error'?
    throw new Error('Field error: value is not an instance of Date');
  }
  if (isNaN(value.getTime())) {
    throw new Error('Field error: value is an invalid Date');
  }
  return value.toJSON();
}

var FactoryDateTime = {
  type: 'Scalar',
  name: 'FactoryDateTime',
  serialize: coerceDate,
  parseValue: coerceDate,
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql;
    var GraphQLError = _graphql.GraphQLError;
    var Kind = _graphql.Kind;


    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Can only parse strings to dates but got a: ' + ast.kind, [ast]);
    }
    var result = new Date(ast.value);
    if (isNaN(result.getTime())) {
      throw new GraphQLError('Query error: Invalid date', [ast]);
    }
    if (ast.value !== result.toJSON()) {
      throw new GraphQLError('Query error: Invalid date format, only accepts: YYYY-MM-DDTHH:MM:SS.SSSZ', [ast]);
    }
    return result;
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

/*
 * Ported type from https://github.com/taion/graphql-type-json
 */

function identity(value) {
  return value;
}

function parseLiteral(ast) {
  var Kind = this.graphql.Kind;

  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      {
        var _ret = function () {
          var value = Object.create(null);
          ast.fields.forEach(function (field) {
            value[field.name.value] = parseLiteral(field.value);
          });
          return {
            v: value
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    case Kind.LIST:
      return ast.values.map(parseLiteral);
    default:
      return null;
  }
}

var FactoryJSON = {
  type: 'Scalar',
  name: 'FactoryJSON',
  description: 'The `JSON` scalar type represents JSON values as specified by ' + '[ECMA-404](http://www.ecma-international.org/ publications/files/ECMA-ST/ECMA-404.pdf).',
  serialize: identity,
  parseValue: identity,
  parseLiteral: parseLiteral
};

var types = {
  FactoryDateTime: FactoryDateTime,
  FactoryJSON: FactoryJSON
};

var index = {
  types: types
};

exports.types = types;
exports['default'] = index;