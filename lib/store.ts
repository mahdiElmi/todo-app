import type { Action, Middleware, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { setInitialTodoState, todosSlice } from "./features/todos/todosSlice";

const rootReducer = combineSlices(todosSlice);

export type RootState = ReturnType<typeof rootReducer>;

const localStorageMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    if (!setInitialTodoState.match(action))
      localStorage.setItem("todos", JSON.stringify(store.getState().todos));

    return result;
  };

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(localStorageMiddleware);
    },
  });
};

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
