import { todoSchema } from "@/lib/zodSchemas";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const todosFromStorage: z.infer<typeof todoSchema> | null =
  localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos")!)
    : null;

const initialState =
  todosFromStorage && todoSchema.safeParse(todosFromStorage).success
    ? todosFromStorage
    : [];

// If you are not using async thunks you can use the standalone `createSlice`.
export const todosSlice = createSlice({
  name: "todos",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    addTodo: create.reducer((state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.unshift({
        value: action.payload,
        isDone: false,
        cratedAt: Date.now(),
      });
    }),

    deleteTodo: create.reducer((state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
    }),

    updateTodoContent: create.reducer(
      (state, action: PayloadAction<{ index: number; newContent: string }>) => {
        state[action.payload.index].value = action.payload.newContent;
      },
    ),

    toggleTodoIsDoneStatus: create.reducer(
      (state, action: PayloadAction<number>) => {
        state[action.payload].isDone = !state[action.payload].isDone;
      },
    ),

    clearAllTodos: create.reducer(() => []),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectCount: (todos) => todos.length,
    selectToDos: (todos) => todos,
  },
});

// Action creators are generated for each case reducer function.
export const {
  addTodo,
  deleteTodo,
  updateTodoContent,
  toggleTodoIsDoneStatus,
  clearAllTodos,
} = todosSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectCount, selectToDos } = todosSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };
