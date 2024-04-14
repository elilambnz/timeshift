import { createContext } from "react";

const SupabaseContext = createContext({
  session: null,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SupabaseProvider({ session, children }: any) {
  return (
    <SupabaseContext.Provider
      value={{
        session,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export { SupabaseContext, SupabaseProvider };
