const clamp = (min: number, val: number, max: number): number => Math.min(Math.max(min, val), max)

export default clamp
