const test = require('zora')
const { FancySet, ImmutableFancySet } = require('./')

test('isSuperset', t => {
  const a = new FancySet([ 1, 2 ])
  const b = new FancySet([ 1, 2, 3 ])

  t.ok(b.isSuperset(a))
  t.notOk(a.isSuperset(b))

  t.ok(a.isSuperset(a))
})

test('ImmutableFancySet add', t => {
  const a = new ImmutableFancySet([ 1, 2 ])
  const b = a.add(3)
  const c = a.add(2)

  t.notEqual(a, b)
  t.notEqual(a, c)
  t.notOk(a.has(3))
})
