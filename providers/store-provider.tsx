"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/redux_store/store";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
