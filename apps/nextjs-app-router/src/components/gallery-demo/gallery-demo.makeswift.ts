import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, unstable_Gallery } from '@makeswift/runtime/controls'

const GALLERY_OPTIONS = [
  {
    id: 'landscape',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=480',
    label: 'Landscape',
    value: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=480',
  },
  {
    id: 'forest',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=480',
    label: 'Forest',
    value: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=480',
  },
  {
    id: 'city',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=480',
    label: 'City',
    value: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=480',
  },
  {
    id: 'mountains',
    thumbnailUrl: 'https://picsum.photos/seed/mountains/480/480',
    label: 'Mountains',
    value: 'https://picsum.photos/seed/mountains/480/480',
  },
  {
    id: 'ocean',
    thumbnailUrl: 'https://picsum.photos/seed/ocean/480/480',
    label: 'Ocean',
    value: 'https://picsum.photos/seed/ocean/480/480',
  },
  {
    id: 'desert',
    thumbnailUrl: 'https://picsum.photos/seed/desert/480/480',
    label: 'Desert',
    value: 'https://picsum.photos/seed/desert/480/480',
  },
  {
    id: 'meadow',
    thumbnailUrl: 'https://picsum.photos/seed/meadow/480/480',
    label: 'Meadow',
    value: 'https://picsum.photos/seed/meadow/480/480',
  },
  {
    id: 'canyon',
    thumbnailUrl: 'https://picsum.photos/seed/canyon/480/480',
    label: 'Canyon',
    value: 'https://picsum.photos/seed/canyon/480/480',
  },
  {
    id: 'harbor',
    thumbnailUrl: 'https://picsum.photos/seed/harbor/480/480',
    label: 'Harbor',
    value: 'https://picsum.photos/seed/harbor/480/480',
  },
  {
    id: 'glacier',
    thumbnailUrl: 'https://picsum.photos/seed/glacier/480/480',
    label: 'Glacier',
    value: 'https://picsum.photos/seed/glacier/480/480',
  },
  {
    id: 'valley',
    thumbnailUrl: 'https://picsum.photos/seed/valley/480/480',
    label: 'Valley',
    value: 'https://picsum.photos/seed/valley/480/480',
  },
  {
    id: 'skyline',
    thumbnailUrl: 'https://picsum.photos/seed/skyline/480/480',
    label: 'Skyline',
    value: 'https://picsum.photos/seed/skyline/480/480',
  },
  {
    id: 'logo-github',
    thumbnailUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=40',
    label: 'GitHub',
    value: 'https://www.google.com/s2/favicons?domain=github.com&sz=40',
  },
  {
    id: 'logo-vercel',
    thumbnailUrl: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=40',
    label: 'Vercel',
    value: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=40',
  },
  {
    id: 'logo-react',
    thumbnailUrl: 'https://www.google.com/s2/favicons?domain=react.dev&sz=40',
    label: 'React',
    value: 'https://www.google.com/s2/favicons?domain=react.dev&sz=40',
  },
  {
    id: 'logo-nextdotjs',
    thumbnailUrl: 'https://www.google.com/s2/favicons?domain=nextjs.org&sz=40',
    label: 'Next.js',
    value: 'https://www.google.com/s2/favicons?domain=nextjs.org&sz=40',
  },
  {
    id: 'logo-typescript',
    thumbnailUrl:
      'https://www.google.com/s2/favicons?domain=typescriptlang.org&sz=40',
    label: 'TypeScript',
    value: 'https://www.google.com/s2/favicons?domain=typescriptlang.org&sz=40',
  },
] as const

runtime.registerComponent(
  lazy(() => import('./gallery-demo')),
  {
    type: 'Gallery Demo',
    label: 'Custom / Gallery Demo',
    props: {
      className: Style(),
      image: unstable_Gallery({
        label: 'Image',
        getOptions: async () => ({ options: [...GALLERY_OPTIONS] }),
      }),
    },
  },
)
