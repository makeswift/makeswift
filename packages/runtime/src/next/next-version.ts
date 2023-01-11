import nextPackageJSON from 'next/package.json'

const { version } = nextPackageJSON

const major = parseInt(version.split('.')[0])

export { major }
