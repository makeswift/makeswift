'use server'

import { mutation } from '../../framework/mutation'

let serverCounter = 0

export async function getServerCounter() {
  return serverCounter
}

export const updateServerCounter = mutation(async (change: number) => {
  serverCounter += change
})
