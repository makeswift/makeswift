import { useContext } from "react";
import { StylesContext, StylesContextValue } from "../components/StylesContextProvider";

export function useStylesContext(): StylesContextValue {
  return useContext(StylesContext)
}
