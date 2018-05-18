const removeFlowTypes = require('flow-remove-types')

module.exports = {
  process(src) {
    return removeFlowTypes(src).toString()
  }
}
