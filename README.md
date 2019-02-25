# FancySet & ImmutableFancySet

## TL;DR

_FancySet_ extends _Set_ to include all the bells and whistles one often needs when working with sets.

_ImmutableFancySet_ extends _FancySet_ with new versions of _add_ and _delete_ that always return a new set (instead of mutating the current one).

If you create a new ImmutableFancySet from an existing ImmutableFancySet. For instance:

```
let a = new ImmutableFancySet([1,2,3]);
b = a.add(4,5);
a // [1,2,3]
b // [1,2,3,4,5]
```
the new IFS can tell you if it's equal to the original IFS it was based on.

Example:
```
let a = new ImmutableFancySet([1,2,3]); // [1,2,3]  does not point to an IFS
b = a.add(4); // [1,2,3,4]  points to a
c = b.add(5); // [1,2,3,4,5]  points to a
d = c.add(6); // [1,2,3,4,5,6]  points to a
e = d.add(7); // [1,2,3,4,5,6,7]  points to a

              // NOTICE! these do not point back to the one before, they point back to the very first.

e.equalToOriginal() // false

f = e.delete(7,6,5,4);

f.equalToOriginal(); // true
```

This ^^^ feature is why ImmutableFancySet (and FancySet) were made. I needed something that would play nice with react state (immutable), but that also was aware of the very first state.



## README

### FancySet

FancySet provides the following methods:

```
isSuperSet
union
intersection
symmetricDifference
difference, 
equal 
equalToOriginal
hasChanged
original
```

_isSuperSet_, _union_, _intersection_, _symmetricDifference_, and _difference_ are taken, with some modification, from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations)

_equal_ builds off of those.

These methods do exactly what you think. I'll explain _equalToOriginal_, _hasChanged_, and _original_ at the end.




### ImmutableFancySet


ImmutableFancySet overrides all of the mutating methods of set—add, delete, and clear—with non-mutating versions, and provides a few more functions which give one a way to know whether or not derived IFSes have deviated from the first one.

ImmutableFancySet provides the following methods:

```
add
delete
clear
isTheOriginal
equalToOriginal
hasChanged
original
```

#### Add

Unlike _Set_'s version of _add_, IFS's _add_ can take multiple arguments, allowing you to add multiple items at once.
Add **does not mutate** the IFS.

```
let a = new ImmutableFancySet(); // a new empty IFS
a.add(5,6,7); // a new IFS with these values: [5,6,7]
a; // empty IFS
```
but instead returns a new IFS.
```
let a = new ImmutableFancySet([1,2,3]);
let b = a.add(5,6,7);
a; // [1,2,3]
b; // [1,2,3,5,6,7]
```


#### Delete

Like _add_, _delete_ can take multiple arguments, and, like _add_, **does not mutate** the IFS.

_delete_ returns a set, unlike _Set_'s _delete_ which returns true or false.

Example:

```
let a = new ImmutableFancySet([1,2,3]);
let b = a.delete(2,3);
a; // [1,2,3]
b; // [1]
```


#### Clear

_clear_ is simply undefined for IFSes.


#### originalImmutableFancySet property

When creating an IFS from another IFS.

```
let a = new ImmutableFancySet([1,2,3]);
b = new ImmutableFancySet(a); // new IFS based off of 'a'
c = a.add(4); // new IFS based off of 'a'
```

The new IFS gets a property _originalImmutableFancySet_, which points to the IFS that the IFS was made from.
**If IFS _x_ is made from IFS _y_, and _y_ has the property _originalImmmutableFancySet_, the _x_'s _originalImmutableFancySet_ will be set to _y_'s _originalImmutableFancySet_.**

Example:

```
let a = new ImmutableFancySet([1,2,3]);
b = a.add(4); oIFS == a
c = b.add(5); oIFS still == a
d = c.add(6); oIFS is, yes, still == a
```

The purpose of this was to have a set that played well with React state (didn't mutate), but, kept track of whether or not it had changed from the original set.

The following methods are tools for working with oIFS

```
isTheOriginal
equalToOriginal
hasChanged
original
```

##### isTheOriginal

Returns true if the IFS _doesn't_ have the property _orignalImmutableFancySet_.

##### equalToOriginal

This example from above illustrates how equalToOriginal works:

Example:

```
let a = new ImmutableFancySet([1,2,3]); // [1,2,3]  does not point to an IFS
b = a.add(4);
c = b.add(5);
d = c.add(6);
e = d.add(7);

e.equalToOriginal() // false

f = e.delete(7,6,5,4);

f.equalToOriginal(); // true
```

##### hasChanged

The negation of _equalToOriginal_. This method is why ImmutableFancySet (and FancySet) were made.

Imagine getting a set from the backend that you store in react state.

The user can add and delete from the set, and you want to provide a save button (save current set state to back-end database) that is enable **only if** the current set is different from the original set received from the back-end. ImmutableFancySet is a datatype that can do all of that for you

```
<button disabled={!set.hasChanged} ... >
```

or however it's easier to read for you 

```
<button disabled={set.equalToOriginal} ... >
```

##### original

Returns either the property originalImmutableFancySet or the ImmutableFancySet itself.
