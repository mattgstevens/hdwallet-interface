// @flow

const flowUtils = require('./flow')

describe('isMaybeType', () => {
  it('should return true when "null"', () => {
    expect(flowUtils.isMaybeType(null)).toBe(true)
  })

  it('should return true when "undefined"', () => {
    expect(flowUtils.isMaybeType(undefined)).toBe(true)
  })

  it('should return false when anything else', () => {
    expect(flowUtils.isMaybeType(0)).toBe(false)
    expect(flowUtils.isMaybeType('')).toBe(false)
    expect(flowUtils.isMaybeType([])).toBe(false)
    expect(flowUtils.isMaybeType({})).toBe(false)
  })
})
