// @flow

// this allows flow to happily check that a variable is a Maybe (`null` or `undefined`)
const isNil = (x: *): %checks => x == null

type DiffT<A> = (Array<A>, Array<A>) => Array<A>
const diff: DiffT<*> = (xs, ys) =>
  xs.reduce((acc, x) => {
    if (ys.indexOf(x) === -1) {
      acc.push(x)
    }
    return acc
  }, [])

type LastT<A> = (Array<A>) => A
const last: LastT<*> = list => list[list.length - 1]

module.exports = {
  diff,
  isNil,
  last
}
