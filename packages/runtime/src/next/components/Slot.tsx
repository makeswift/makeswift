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

export const Slot = ({ label, snapshot, fallback }: Props) => {

  return (
    <PropsContextProvider value={{fallback}}>
      <MakeswiftComponent
        snapshot={snapshot}
        label={label}
        type={MakeswiftComponentType.Slot}
      />
    </PropsContextProvider>
  )
}

export default Slot
