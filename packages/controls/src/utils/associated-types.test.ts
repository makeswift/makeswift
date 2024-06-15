import {
  type AssociatedType,
  type WithAssociatedTypes,
  type HasAssociatedTypes,
} from './associated-types'

describe('AssociatedTypes', () => {
  it('associated types merged with & are combined', () => {
    type Fruit<Name extends string> = WithAssociatedTypes<{ Name: Name }> & { name: Name }
    type Apple<Sort extends string> = Fruit<'apple'> &
      WithAssociatedTypes<{ Sort: Sort }> & { sort: Sort }

    const a: Apple<'Honeycrisp'> = { name: 'apple', sort: 'Honeycrisp' }
    const name: AssociatedType<typeof a, 'Name'> = a.name
    const sort: AssociatedType<typeof a, 'Sort'> = a.sort

    expect(name).toBe('apple')
    expect(sort).toBe('Honeycrisp')
  })

  it('HasAssociatedTypes is true when associated types are present', () => {
    type Fruit<Name extends string> = WithAssociatedTypes<{ Name: Name }>

    const appleHasTypes: HasAssociatedTypes<Fruit<'apple'>> = true
    const objectHasTypes: HasAssociatedTypes<{}> = false

    expect(appleHasTypes).toBe(true)
    expect(objectHasTypes).toBe(false)
  })
})
