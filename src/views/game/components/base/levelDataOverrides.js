import luaparse from 'luaparse'

const parseLevelData = levelData => luaparse.parse(levelData, { ranges: true })

const getFieldKey = field => {
  if (field.type === 'TableKeyString') {
    return field.key.name
  }

  if (field.type === 'TableKey' && field.key.type === 'StringLiteral') {
    return getStringValue(field.key)
  }

  return null
}

const getStringValue = node => {
  if (typeof node.value === 'string') {
    return node.value
  }

  const raw = node.raw || ''
  const body = raw.slice(1, -1)

  const escapes = {
    '\\': '\\',
    '"': '"',
    "'": "'",
    n: '\n',
    r: '\r',
    t: '\t',
    b: '\b',
    f: '\f',
    v: '\v',
  }

  return body.replace(/\\([\\"'nrtbfv])/g, (match, character) => escapes[character] ?? match)
}

const getOverridesTable = ast => {
  const returnStatement = ast.body.find(statement => statement.type === 'ReturnStatement')
  const returnTable = returnStatement?.arguments?.find(argument => argument.type === 'TableConstructorExpression')

  if (!returnTable) {
    return null
  }

  const overridesField = returnTable.fields.find(field => getFieldKey(field) === 'overrides')

  return overridesField?.value?.type === 'TableConstructorExpression' ? overridesField.value : null
}

const getOverrideValue = (node, levelData) => {
  if (node.type === 'StringLiteral') {
    return {
      type: 'string',
      value: getStringValue(node),
      raw: node.raw,
    }
  }

  if (node.type === 'NumericLiteral') {
    return {
      type: 'number',
      value: node.value,
      raw: node.raw,
    }
  }

  if (node.type === 'BooleanLiteral') {
    return {
      type: 'boolean',
      value: node.value,
      raw: node.raw,
    }
  }

  return {
    type: 'complex',
    value: null,
    raw: node.range ? levelData.slice(node.range[0], node.range[1]) : node.type,
  }
}

const toLuaString = value => `"${String(value)
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"')
  .replace(/\r/g, '\\r')
  .replace(/\n/g, '\\n')
  .replace(/\t/g, '\\t')
  .replaceAll(String.fromCharCode(8), '\\b')
  .replace(/\f/g, '\\f')
  .replace(/\v/g, '\\v')}"`

const serializeOverrideValue = (type, value) => {
  if (type === 'string') {
    return toLuaString(value)
  }

  if (type === 'number') {
    if (typeof value === 'string' && value.trim() === '') {
      throw new Error('Numeric override value cannot be empty')
    }

    const numberValue = Number(value)

    if (!Number.isFinite(numberValue)) {
      throw new Error('Invalid numeric override value')
    }

    return String(numberValue)
  }

  if (type === 'boolean') {
    return value ? 'true' : 'false'
  }

  throw new Error(`Unsupported override value type: ${type}`)
}

export const readLevelDataOverrides = levelData => {
  const ast = parseLevelData(levelData)
  const overridesTable = getOverridesTable(ast)
  const values = {}
  const entries = []

  if (!overridesTable) {
    return { values, entries }
  }

  for (const field of overridesTable.fields) {
    const name = getFieldKey(field)

    if (!name || !field.value) {
      continue
    }

    const overrideValue = getOverrideValue(field.value, levelData)

    values[name] = overrideValue.type === 'string'
      ? overrideValue.value
      : String(overrideValue.value)
    entries.push({ name, ...overrideValue })
  }

  return { values, entries }
}

export const replaceLevelDataOverride = (levelData, name, type, value) => {
  const ast = parseLevelData(levelData)
  const overridesTable = getOverridesTable(ast)
  const field = overridesTable?.fields.find(item => getFieldKey(item) === name)

  if (!field?.value?.range) {
    throw new Error(`Override not found: ${name}`)
  }

  const replacement = serializeOverrideValue(type, value)
  const [start, end] = field.value.range

  return `${levelData.slice(0, start)}${replacement}${levelData.slice(end)}`
}
