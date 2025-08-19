import Player from 'react-player'

import { esmCompat } from '../../utils/esm-compat'

// Vite SSR/ESM compatibility; upgrading to the latest ESM-only version of
// `react-player` removes the need for this workaround but breaks Jest
export const ReactPlayer = esmCompat(Player)
