"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ReactNode, createContext, useContext } from "react";
import { getUseCaseInstances } from "@/application/di/container";

/** UseCaseインスタンスを提供するコンテキスト */
export const UseCaseContext = createContext<ReturnType<
  typeof getUseCaseInstances
> | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  // Composition Root: ユースケースインスタンスを生成
  const useCases = getUseCaseInstances();
  return (
    <UseCaseContext.Provider value={useCases}>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </UseCaseContext.Provider>
  );
}

/** UseCaseContext を利用するフック */
export function useUseCaseContext() {
  const context = useContext(UseCaseContext);
  if (!context) {
    throw new Error("useUseCaseContext must be used within Providers");
  }
  return context;
}
