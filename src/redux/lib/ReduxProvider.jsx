"use client";
import { persistor, store } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

export default function ReduxProviders({ children }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
