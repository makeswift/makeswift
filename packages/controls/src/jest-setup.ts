let uidSuffix = 100000000000
jest.mock('uuid', () => ({
  v4: jest.fn(() => `xxxxxxxx-xxxx-xxxx-xxxx-${uidSuffix++}`),
}))
