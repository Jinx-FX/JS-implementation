function fakeParseJSON (str) {
  let i = 0

  return parseValue()

  function parseValue () {
    skipWhiteSpece()
    const value =
      parseString() ??
      parseNumber() ??
      parseObject() ??
      parseArray() ??
      parseKeyword('true', true) ??
      parseKeyword('false', false) ??
      parseKeyword('null', null)
    skipWhiteSpece()
    return value
  }

  function skipWhiteSpece () {
    while (str[i] === ' ' || str[i] === '\n' || str[i] === '\r') {
      i++
    }
  }

  function parseString () {
    if (str[i] === '"') {
      i++
      let result = ''
      while (str[i] !== '"') {
        result += str[i]
        i++
      }
      i++
      return result
    }
  }

  function parseNumber () {
    let start = i
    if (str[i] === '-') {
      i++
    }
    if (str[i] === '0') {
      i++
    } else if (str[i] >= '1' && str[i] <= '9') {
      i++
      while (str[i] >= '0' && str[i] <= '9') {
        i++
      }
    }

    if (str[i] === '.') {
      i++
      while (str[i] >= '0' && str[i] <= '9') {
        i++
      }
    }
    if (str[i] === 'e' || str[i] === 'E') {
      i++
      if (str[i] === '-' || str[i] === '+') {
        i++
      }
      while (str[i] >= '0' && str[i] <= '9') {
        i++
      }
    }
    if (i > start) {
      return Number(str.slice(start, i))
    }
  }

  function parseObject () {
    if (str[i] === '{') {
      i++
      skipWhiteSpece()

      const result = {}

      let isInit = true
      while (str[i] !== '}') {
        if (!isInit) {
          eatComma()
          skipWhiteSpece()
        }
        const key = parseString()
        skipWhiteSpece()
        eatColon()
        const value = parseValue()
        result[key] = value
        isInit = false
      }

      i++
      return result
    }
  }

  function parseArray () {
    if (str[i] === '[') {
      i++
      skipWhiteSpece()

      const result = []
      let isInit = true
      while (str[i] !== ']') {
        if (!isInit) {
          eatComma()
        }
        const value = parseValue()
        result.push(value)
        isInit = false
      }
      i++
      return result
    }
  }

  function parseKeyword (name, value) {
    if (str.slice(i, i + name.length) === name) {
      i += name.length
      return value
    }
  }

  function eatComma () {
    if (str[i] !== ',') {
      throw new Error('Expected ",".')
    }
    i++

    checkNotEmpty()
  }

  function eatColon () {
    if (str[i] !== ':') {
      throw new Error('Expected ":".')
    }
    i++

    checkNotEmpty()
  }

  function checkNotEmpty () {
    if (str[i] === '}' || str[i] === ']') {
      throw new Error('Empty is not allowed')
    }
    i++
  }
}

