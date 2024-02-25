import React, { createContext, useReducer, Dispatch } from "react";

const initialState = {
  userId: null,
  isLeader: {},
}


const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_ID":
      console.log("New user id:", action.payload);
      return { ...state, userId: action.payload };
    case "SET_IS_LEADER":
      console.log("New leader status:", action.payload);
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

