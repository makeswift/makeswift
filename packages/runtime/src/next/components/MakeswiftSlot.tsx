'use client'

import { createContext, ReactNode } from "react";
import { MakeswiftComponentSnapshot } from "../client";
import { MakeswiftComponentType } from "../../components";
import { MakeswiftComponent } from "./MakeswiftComponent";


type Props = {
  label: string
  snapshot: MakeswiftComponentSnapshot
  fallback?: ReactNode
}

export const PropsContext = createContext<{fallback: ReactNode}>({fallback: null});

export const PropsContextProvider = ({ value, children }: { value: {fallback: ReactNode}, children: ReactNode }) => (
  <PropsContext.Provider value={value}>{children}</PropsContext.Provider>
);

export const MakeswiftSlot = ({ label, snapshot, fallback }: Props) => {
  const componentType = MakeswiftComponentType.Slot

  return (
    <PropsContextProvider value={{fallback}}>
      <MakeswiftComponent
        snapshot={snapshot}
        label={label}
        type={componentType}
      />
    </PropsContextProvider>
  )
}

export default MakeswiftSlot
