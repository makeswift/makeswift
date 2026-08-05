import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import {
  Combobox,
  Group,
  Style,
  unstable_Gallery,
} from '@makeswift/runtime/controls'
import {
  loadPokemonList,
  loadPokemonSprites,
  Pokemon,
  spriteOptions,
} from './poke-api'

type PokemonSelectionOptionsContext = {
  generation: { value: number } | null
}

type SpriteOptionsContext = {
  selectedPokemon: { value: Pokemon } | null
}

const MAX_COMBOBOX_RESULTS = 50

const PokemonSelector = () =>
  Group({
    label: 'Pokémon',
    props: {
      generation: Combobox({
        label: 'Generation',
        getOptions: () =>
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => ({
            id: g.toString(),
            value: g,
            label: g.toString(),
          })),
      }),

      selection: Combobox({
        label: 'Selection',
        requiredOptionsContext: {
          generation: 'pokemon.value.generation',
        },
        getOptions: async (query, ctx: PokemonSelectionOptionsContext) => {
          if (!ctx.generation) {
            return []
          }

          const list = await loadPokemonList(ctx.generation.value)
          const q = query.toLowerCase()
          return list
            .filter((p) => p.name.includes(q))
            .slice(0, MAX_COMBOBOX_RESULTS)
            .map((p) => ({ id: p.name, value: p, label: p.name }))
        },
      }),
    },
  })

runtime.registerComponent(
  lazy(() => import('./pokemon-demo')),
  {
    type: 'Pokemon Demo',
    label: 'Custom / Pokémon Demo',
    props: {
      className: Style(),
      pokemon: PokemonSelector(),
      sprite: unstable_Gallery({
        label: 'Sprite',
        requiredOptionsContext: {
          selectedPokemon: 'pokemon.value.selection',
        },
        getOptions: async (ctx: SpriteOptionsContext) => {
          const name = ctx.selectedPokemon?.value.name

          if (name == null) return { options: [] }

          try {
            const sprites = await loadPokemonSprites(name)
            return { options: spriteOptions(sprites) }
          } catch {
            return { options: [] }
          }
        },
      }),
    },
  },
)
