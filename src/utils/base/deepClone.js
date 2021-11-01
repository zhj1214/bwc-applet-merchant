
// 使用WeakMap判断是否形成了环，避免爆栈
const hash = new WeakMap()

function hasHash(value) {
  return hash.has(value)
}

function setHash(value, result) {
  hash.set(value, result)
}

function getHash(value) {
  return hash.get(value)
}

function getSymbols(value) {
  let symKeys = []
  const propertyIsEnumerable = Object.prototype.propertyIsEnumerable
  const nativeGetSymbols = Object.getOwnPropertySymbols
  symKeys = nativeGetSymbols(value)
  // 判断是否是可枚举的属性
  symKeys = symKeys.filter(symkey => propertyIsEnumerable.call(value, symkey))
  return symKeys
}

function getAllKeys(value) {
  let keys = Object.keys(value)
  keys = [...keys, ...getSymbols(value)]
  return keys
}

const types = {
  '[object Array]': true,
  '[object Boolean]': true,
  '[object Date]': true,
  '[object Map]': true,
  '[object Set]': true,
  '[object Number]': true,
  '[object Object]': true,
  '[object RegExp]': true,
  '[object Symbol]': true,
  '[object String]': true,
  '[object ArrayBuffer]': true,
  '[object Function]': true,
  '[object WeakMap]': false,
  '[object Error]': false
}

function isObject(value) {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function')
}

function getType(value) {
  return Object.prototype.toString.call(value);
}

function initCloneArray(value) {
  const { length } = value
  return new value.constructor(length)
}

function initCloneArrayBuffer(value) {
  const result = new value.constructor(value.byteLength)
  new Uint8Array(result).set(new Uint8Array(value))
  return result
}

function initCloneObject(value) {
  return Object.create(Object.getPrototypeOf(value))
}

function initCloneRegExp(value) {
  return new RegExp(value.source,
    (value.global ? 'g' : '') +
    (value.ignoreCase ? 'i' : '') +
    (value.multiline ? 'm' : '') +
    (value.sticky ? 'y' : '') +
    (value.unicode ? 'u' : '')
  )
}

function initCloneFunction(value) {
  return function (...args) {
    return value.apply(null, ...args)
  }
}

function initClone(value, type) {
  const Ctor = value.constructor
  switch (type) {
    case '[object ArrayBuffer]':
      return initCloneArrayBuffer(value)
    case '[object Date]':
    case '[object Map]':
    case '[object Set]':
      return new Ctor(value)
    case '[object RegExp]':
      return initCloneRegExp(value)
    case '[object Array]':
      return initCloneArray(value)
    case '[object Object]':
      return initCloneObject(value)
    case '[object Function]':
      return initCloneFunction(value)
  }
}

export default function deepClone(value) {

  let result;

  const type = getType(value)

  // 如果不是引用类型直接返回
  if (!isObject(value)) {
    return value
  }

  // 如果是weakMap，Error类型直接返回
  if (!types[type]) {
    return value
  }

  let isArr = Array.isArray(value)

  result = initClone(value, type)

  // 判断是否产生了循环引用, 避免爆栈
  if (hasHash(value)) {
    // 如果存在直接返回
    return getHash(value)
  }
  // 在weakMap添加标记
  setHash(value, result)

  if (type === '[object Map]') {
    value.forEach((val, key) => {
      result.set(key, deepClone(val))
    })
    return result
  }

  if (type === '[object Set]') {
    value.forEach((val) => {
      result.add(deepClone(val))
    })
    return result
  }

  const props = getAllKeys(value)

  for (let i = 0; i < props.length; i++) {
    const key = props[i]
    const val = value[key]
    result[key] = deepClone(val)
  }

  return result
}

