export function buildHydrationScript(namespace: string, props: any): string {
  return `
    <script>
      window['${namespace}'] = ${JSON.stringify(props)};
    </script>
    <script src="/static/client.js"></script>
  `
}