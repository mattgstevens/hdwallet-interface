// @flow

// this allows flow to happily check that a variable is a Maybe (`null` or `undefined`)
const isMaybeType = (x: *): %checks => x == null

module.exports = {
  isMaybeType
}
