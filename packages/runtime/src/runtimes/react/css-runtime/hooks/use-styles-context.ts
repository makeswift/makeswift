import { useContext } from "react";
import { StylesContext, StylesContextValue } from "../components/styles-context-provider";

export function useStylesContext(): StylesContextValue {
  return useContext(StylesContext)
}
