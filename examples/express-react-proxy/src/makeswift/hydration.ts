export const HYDRATION_PROPS_NAMESPACE = '__MAKESWIFT_PROPS__'

export function hydrationScript(props: any): string {
  return `
    <script>
      window['${HYDRATION_PROPS_NAMESPACE}'] = ${JSON.stringify(props)};
    </script>
    <script src="/static/client.js"></script>
  `
}
