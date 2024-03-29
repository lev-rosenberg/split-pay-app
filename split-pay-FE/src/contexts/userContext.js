import React, { createContext, useReducer } from "react";

const initialState = {
  userId: null,
  signedIn: false,
  isLeader: {}
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    case "SET_SIGNED_IN":
      return { ...state, signedIn: action.payload };
    case "SET_IS_LEADER":
      return { ...state, isLeader: {...state.isLeader, [action.payload.groupId]: action.payload.isLeader}};
    default:
      return state;
  }
};

export const Context = createContext({
  state: initialState,
  dispatch: (() => {})
});

export const ContextProvider = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

