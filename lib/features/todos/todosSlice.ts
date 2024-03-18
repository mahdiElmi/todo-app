import { todoSchema } from "@/lib/zodSchemas";
import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const initialState: z.infer<typeof todoSchema> = {};

// If you are not using async thunks you can use the standalone `createSlice`.
export const todosSlice = createSlice({
  name: "todos",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    setInitialTodoState: create.reducer(
      (state, action: PayloadAction<z.infer<typeof todoSchema>>) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        return { ...action.payload };
      },
    ),
    addTodo: create.reducer((state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        [nanoid()]: {
          value: action.payload,
          isDone: false,
        },
        ...state,
      };
    }),

    deleteTodo: create.reducer((state, action: PayloadAction<string>) => {
      delete state[action.payload];
    }),

    updateTodoContent: create.reducer(
      (state, action: PayloadAction<{ id: string; newContent: string }>) => {
        state[action.payload.id].value = action.payload.newContent;
      },
    ),

    toggleTodoIsDoneStatus: create.reducer(
      (state, action: PayloadAction<string>) => {
        state[action.payload].isDone = !state[action.payload].isDone;
      },
    ),

    clearAllTodos: create.reducer(() => ({})),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectTodos: (todos) => todos,
  },
});

// Action creators are generated for each case reducer function.
export const {
  setInitialTodoState,
  addTodo,
  deleteTodo,
  updateTodoContent,
  toggleTodoIsDoneStatus,
  clearAllTodos,
} = todosSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectTodos } = todosSlice.selectors;
