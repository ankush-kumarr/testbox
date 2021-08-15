import React, { createContext, useReducer } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const defaultState = {
  userDetails: {},
  token: {},
  sectionCreated: false,
};

export const AppContext = createContext<{
  state: typeof defaultState;
  dispatch: React.Dispatch<any>;
}>({
  state: defaultState,
  dispatch: () => null,
});

const contextreducer = (
  state: typeof defaultState,
  action: any
): typeof defaultState => {
  switch (action.type) {
    case "UPDATE_SECTION_CREATED":
      return { ...state, sectionCreated: action.data };
    case "UPDATE_SECTION_RESET":
      return { ...state, sectionCreated: action.data };
    default:
      return defaultState;
  }
};
const MainLayout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const [state, dispatch] = useReducer(contextreducer, defaultState);
  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children || null}
    </AppContext.Provider>
  );
};

export default MainLayout;
