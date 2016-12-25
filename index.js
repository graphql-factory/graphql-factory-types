'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var FactoryBase64 = {
  type: 'Scalar',
  name: 'FactoryBase64',
  description: 'Converts value to and from base64',
  serialize: function serialize(value) {
    return new Buffer(value, 'base64').toString();
  },
  parseValue: function parseValue(value) {
    return new Buffer(value).toString('base64');
  },
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql,
        GraphQLError = _graphql.GraphQLError,
        Kind = _graphql.Kind;


    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: expected Base64 to be a string but got a: ' + ast.kind, [ast]);
    }

    return new Buffer(ast.value).toString('base64');
  }
};

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
  description: 'Represents a Date object',
  serialize: coerceDate,
  parseValue: coerceDate,
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql,
        GraphQLError = _graphql.GraphQLError,
        Kind = _graphql.Kind;


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

var FactoryEmail = {
  type: 'Scalar',
  name: 'FactoryEmail',
  description: 'The Email scalar type represents E-Mail addresses compliant to RFC 822.',
  serialize: function serialize(value) {
    return value;
  },
  parseValue: function parseValue(value) {
    return value;
  },
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql,
        GraphQLError = _graphql.GraphQLError,
        Kind = _graphql.Kind;

    // regex taken from https://github.com/stylesuxx/graphql-custom-types

    var rx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: expected Email to be a string but got a: ' + ast.kind, [ast]);
    }

    if (!ast.value.match(rx)) {
      throw new GraphQLError('Query error: invalid Email', [ast]);
    }

    return ast.value;
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/*
 * Ported type from https://github.com/taion/graphql-type-json
 */

function identity(value) {
  return value;
}

function parseLiteral(ast) {
  var boundParseLiteral = parseLiteral.bind(this);
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
            value[field.name.value] = boundParseLiteral(field.value);
          });
          return {
            v: value
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    case Kind.LIST:
      return ast.values.map(boundParseLiteral);
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

var FactoryURL = {
  type: 'Scalar',
  name: 'FactoryURL',
  description: 'The URL scalar type represents URL addresses.',
  serialize: function serialize(value) {
    return value;
  },
  parseValue: function parseValue(value) {
    return value;
  },
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql,
        GraphQLError = _graphql.GraphQLError,
        Kind = _graphql.Kind;

    // regex taken from https://github.com/stylesuxx/graphql-custom-types

    var rx = new RegExp('^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$', 'i');

    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: expected URL to be a string but got a: ' + ast.kind, [ast]);
    }

    if (!ast.value.match(rx)) {
      throw new GraphQLError('Query error: invalid URL', [ast]);
    }

    return ast.value;
  }
};

var types = {
  FactoryBase64: FactoryBase64,
  FactoryDateTime: FactoryDateTime,
  FactoryEmail: FactoryEmail,
  FactoryJSON: FactoryJSON,
  FactoryURL: FactoryURL
};

var index = {
  name: 'GraphQLFactoryTypes',
  types: types
};

exports.types = types;
exports['default'] = index;
