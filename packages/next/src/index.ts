console.log('Hello world')

import { z } from 'zod'

const buttonSchema = z.object({
  type: z.literal('./components/Button/index.js'),
  props: z.object({
    color: z.array(
      z.object({
        deviceId: z.string(),
        value: z.object({
          alpha: z.number(),
          swatchId: z.string(),
        }),
      }),
    ),
  }),
})

const swatchSchema = z.object({
  id: z.string(),
  hue: z.number(),
  saturation: z.number(),
  lightness: z.number(),
})
type Swatch = z.infer<typeof swatchSchema>

type Button = z.infer<typeof buttonSchema>

const childrenSchema = z.object({
  elements: z.array(buttonSchema),
})

const rootSchema = z.object({
  type: z.literal('./components/Root/index.js'),
  props: z.object({
    id: z.string(),
    children: childrenSchema,
  }),
})

type Root = z.infer<typeof rootSchema>

const hydratedButtonSchema = z.object({
  type: z.literal('./components/Button/index.js'),
  props: z.object({
    color: z.array(
      z.object({
        deviceId: z.string(),
        value: z.object({
          alpha: z.number(),
          swatchId: z.string(),
          swatchValue: swatchSchema,
        }),
      }),
    ),
  }),
})

type HydratedButton = z.infer<typeof hydratedButtonSchema>

const hydratedChildrenSchema = z.object({
  elements: z.array(hydratedButtonSchema),
})

const hydratedRootSchema = z.object({
  type: z.literal('./components/Root/index.js'),
  props: z.object({
    id: z.string(),
    children: hydratedChildrenSchema,
  }),
})

type HydratedRoot = z.infer<typeof hydratedRootSchema>

type HydratedElement = HydratedButton | HydratedRoot

type Element = Button | Root

export function introspection(element: Element): {
  swatchIds: string[]
} {
  switch (element.type) {
    case './components/Button/index.js':
      return {
        swatchIds: element.props.color.map((color) => color.value.swatchId),
      }

    case './components/Root/index.js':
      return {
        swatchIds: element.props.children.elements
          .map((element) => introspection(element).swatchIds)
          .flat(),
      }
  }
}

export async function fetchSwatch(id: string) {
  const response = await fetch(`https://api.makeswift.com/v1/swatches/${id}`, {
    headers: {
      ['X-API-Key']: '39c368c4-e758-45d5-8836-9df3de2969c0',
      'Makeswift-Site-API-Key': '39c368c4-e758-45d5-8836-9df3de2969c0',
      'Makeswift-Site-Version': 'Working',
    },
  })

  return response.json()
}

export async function fetchResources({
  swatchIds,
}: {
  swatchIds: string[]
}): Promise<Swatch[]> {
  return Promise.all(swatchIds.map(fetchSwatch))
}

export function hydrate(element: Element, swatches: Swatch[]): HydratedElement {
  switch (element.type) {
    case './components/Button/index.js':
      return {
        ...element,
        props: {
          ...element.props,
          color: element.props.color.map((color) => ({
            ...color,
            value: {
              ...color.value,
              swatchValue: swatches.find(
                (swatch) => swatch.id === color.value.swatchId,
              ) as Swatch,
            },
          })),
        },
      }

    case './components/Root/index.js':
      return {
        ...element,
        props: {
          ...element.props,
          children: {
            ...element.props.children,
            elements: element.props.children.elements.map((element) =>
              hydrate(element, swatches),
            ) as HydratedButton[],
          },
        },
      }
  }
}

export async function getHydratedSnapshot({ pathName}: any) {
  console.log(process.env.MAKESWIFT_SITE_API_KEY)
  const response = await fetch(
    `https://api.makeswift.com/v3/pages/${encodeURIComponent(
      pathName,
    )}/document`,
    {
      headers: {
        ['X-API-Key']: process.env.MAKESWIFT_SITE_API_KEY,
        'Makeswift-Site-API-Key':process.env.MAKESWIFT_SITE_API_KEY ,
        'Makeswift-Site-Version': 'Working',
      },
    },
  )

  const unhydratedElementTree = await response.json()

  const { swatchIds } = introspection(unhydratedElementTree.data)

  const swatches = await fetchResources({ swatchIds })

  const hydratedElementTree = hydrate(unhydratedElementTree.data, swatches)

  return hydratedElementTree
}
