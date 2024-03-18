import { todoSchema } from "@/lib/zodSchemas";
import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const initialState: z.infer<typeof todoSchema> = {};

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: (create) => ({
    setInitialTodoState: create.reducer(
      (state, action: PayloadAction<z.infer<typeof todoSchema>>) => {
        return { ...action.payload };
      },
    ),
    addTodo: create.reducer((state, action: PayloadAction<string>) => {
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

  selectors: {
    selectTodos: (todos) => todos,
  },
});

export const {
  setInitialTodoState,
  addTodo,
  deleteTodo,
  updateTodoContent,
  toggleTodoIsDoneStatus,
  clearAllTodos,
} = todosSlice.actions;

export const { selectTodos } = todosSlice.selectors;
