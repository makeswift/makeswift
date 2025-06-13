import { ReactRuntime } from "@makeswift/runtime/react";
import { TextInput } from "@makeswift/runtime/controls";
import Button from "./Button";

export function register(runtime: ReactRuntime): () => void {
  return runtime.registerComponent(
    Button,
    {
      type: 'button',
      label: 'Button',
      props: {}
    }
  )
}