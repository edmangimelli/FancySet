const smallerBigger = (a, b) => a.length < b.length ? [a, b] : [b, a];

class FancySet extends Set {
  constructor(x, makeCopyOfSet = true) {
    super(x);
    if (makeCopyOfSet)
      this.originalFancySet = new FancySet(x, false);
  }

  isSuperset(subset) {
    for (var s of subset) if (!this.has(s)) return false;
    return true;
  }

  union(otherSet) {
    const [smallerSet, biggerSet] = smallerBigger(this, otherSet);
    const union = new Set(biggerSet);
    for (const v of smallerSet) union.add(v);
    return union;
  }

  intersection(otherSet) {
    const intersection = new Set();
    const [smallerSet, biggerSet] = smallerBigger(this, otherSet);
    for (const v of smallerSet) if (biggerSet.has(v)) intersection.add(v);
    return intersection;
  }

  symmetricDifference(otherSet) {
    const [smallerSet, biggerSet] = smallerBigger(this, otherSet);
    const difference = new Set(biggerSet);
    for (const v of smallerSet) {
      if (difference.has(v)) difference.delete(v);
      else difference.add(v);
    }
    return difference;
  }

  difference(otherSet) {
    const difference = new Set(this);
    for (const v of otherSet) difference.delete(v);
    return difference;
  }

  equal(otherSet) {
    if (this.size !== otherSet.size) return false;
    return this.difference(otherSet).size === 0;
  }

  equalToOriginal() {
    return this.equal(this.originalFancySet);
  }

  hasChanged() {
    return !this.equalToOriginal();
  }

  original() {
    return this.originalFancySet || this;
  }
}





function immutableActionHelper({items, action}) {
  action = Set.prototype[action];
  const result = new ImmutableFancySet(this);
  for (item of new Set(items)) action.call(result, item);
  return result;
}

protoWithAddAndDeleteOverrided = {
  add: function(...items) {
    return immutableActionHelper.call(this, {items, action: 'add'})
  },

  delete: function(...items) {
    return immutableActionHelper.call(this, {items, action: 'delete'})
  },

  isTheOriginal: function() {
    return !this.originalImmutableFancySet;
  },

  equalToOriginal: function() {
    if (this.isTheOriginal())
      return true;
    return this.equal(this.originalImmutableFancySet);
  },

  hasChanged: function() {
    return !this.equalToOriginal();
  },

  original: function() {
    return this.originalImmutableFancySet || this;
  },

  clear: undefined,
}
Object.setPrototypeOf(protoWithAddAndDeleteOverrided, FancySet.prototype);

class ImmutableFancySet extends FancySet {
  constructor(x) {
    super(x);
    Object.setPrototypeOf(this, protoWithAddAndDeleteOverrided);

    if ([undefined, null].includes(x))
      return;
    if (Object.getPrototypeOf(x) === protoWithAddAndDeleteOverrided) {
      this.originalImmutableFancySet = x.original();
    }
  }
}
