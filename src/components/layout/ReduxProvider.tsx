"use client";

import { store } from "@/libs/redux/store";
import { ChildrenProps } from "@/type/children";
import { Provider } from "react-redux";

function ReduxProvider({ children }: ChildrenProps) {
  return <Provider store={store}>{children}</Provider>;
}
export default ReduxProvider;
