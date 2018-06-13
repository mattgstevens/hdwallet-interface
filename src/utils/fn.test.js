// @flow

const fns = require('./fn')

describe('diff', () => {
  it('should return the difference of elements between first argument and second', () => {
    expect(fns.diff([1, 2, 3], [1, 4, 5])).toEqual([2, 3])
  })
})

describe('isNil', () => {
  it('should return true when "null"', () => {
    expect(fns.isNil(null)).toBe(true)
  })

  it('should return true when "undefined"', () => {
    expect(fns.isNil(undefined)).toBe(true)
  })

  it('should return false when anything else', () => {
    expect(fns.isNil(0)).toBe(false)
    expect(fns.isNil('')).toBe(false)
    expect(fns.isNil([])).toBe(false)
    expect(fns.isNil({})).toBe(false)
  })
})

describe('last', () => {
  it('should return the last element in the list', () => {
    expect(fns.last([1, 2, 3])).toEqual(3)
  })
})
