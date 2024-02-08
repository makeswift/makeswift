# Running a local version of the Makeswift CLI


1. Modify the CLI so you know when you're running the local version

  I like to add a console log to `/your/local/makeswift/packages/makeswift/src/init.ts` 

  ```diff
  export default async function wrappedInit(name: string | undefined, args: InitArgs) {
  + console.log(`\n\n\nRunning Local Version\n\n\n`)
    try {
      await init(name, args)
    } catch (err) {
      if (err instanceof MakeswiftError) {
        console.log(err.message)
        process.exit(0)
      } else {
        throw err
      }
    }
  }
  ```
2. Run the CLI in dev mode
  ```sh
  pnpm i --ignore-scripts
  pnpm -F makeswift dev
  ```
3. Globally link the CLI
  ```sh
  pnpm link --global --dir /your/local/makeswift/packages/makeswift
  ```
4. Create a temp directory
  ```sh
  cd $(mktemp -d)
  ```
5. Test the app by running 
  ```
  makeswift init test-app
  makeswift init test-app --with-bun
  makeswift init test-app --with-pnpm
  
  // etc...
  ```
6. When you are done, remove the linked version of the CLI 
  ```sh
  pnpm uninstall --global makeswift
  ```