/** @jest-environment jsdom */
import { Combobox } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe('Combobox control data', () => {
    describe('primitive values', () => {
      test.each([
        {
          id: '1',
          label: 'One',
          value: 'one',
        },
        {
          id: '2',
          label: 'Two',
          value: 'two',
        },
        {
          id: '3',
          label: 'Three',
          value: 'three',
        },
        undefined,
      ] as const)(`resolves when value is %s`, async value => {
        await testPageControlPropRendering(
          Combobox({
            getOptions: () => {
              return [
                { label: 'One', value: 'one', id: '1' },
                { label: 'Two', value: 'two', id: '2' },
                { label: 'Three', value: 'three', id: '3' },
              ]
            },
          }),
          { value },
        )
      })
    })

    describe('object values', () => {
      test.each([
        {
          id: '1',
          label: 'One',
          value: { id: '1', name: 'one' },
        },
        {
          id: '2',
          label: 'Two',
          value: { id: '2', name: 'two' },
        },
        {
          id: '3',
          label: 'Three',
          value: { id: '3', name: 'three' },
        },
        undefined,
      ] as const)(`resolves when value is %s`, async value => {
        await testPageControlPropRendering(
          Combobox({
            getOptions: () => {
              return [
                { label: 'One', value: { id: '1', name: 'one' }, id: '1' },
                { label: 'Two', value: { id: '2', name: 'two' }, id: '2' },
                { label: 'Three', value: { id: '3', name: 'three' }, id: '3' },
              ]
            },
          }),
          { value },
        )
      })
    })

    describe('async getOptions', () => {
      test.each([
        {
          id: '1',
          label: 'One',
          value: { id: '1', name: 'one' },
        },
        {
          id: '2',
          label: 'Two',
          value: { id: '2', name: 'two' },
        },
        {
          id: '3',
          label: 'Three',
          value: { id: '3', name: 'three' },
        },
        undefined,
      ] as const)(`resolves when value is %s`, async value => {
        async function simulateAsync() {
          return Promise.resolve([
            { label: 'One', value: { id: '1', name: 'one' }, id: '1' },
            { label: 'Two', value: { id: '2', name: 'two' }, id: '2' },
            { label: 'Three', value: { id: '3', name: 'three' }, id: '3' },
          ])
        }

        await testPageControlPropRendering(
          Combobox({
            getOptions: async () => {
              return await simulateAsync()
            },
          }),
          { value },
        )
      })
    })
  })
})
