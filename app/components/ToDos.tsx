"use client";

import { FormEvent, useState } from "react";
import z from "zod";
import {
  addTodo,
  deleteTodo,
  selectCount,
  selectToDos,
  updateTodoContent,
  toggleTodoIsDoneStatus,
  clearAllTodos,
} from "@/lib/features/todos/todosSlice";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Button, Checkbox, IconButton, Input, Typography } from "@mui/joy";
import { Check, Edit, Plus, Trash } from "lucide-react";
import { todoSchema } from "@/lib/zodSchemas";

export const ToDos = () => {
  const dispatch = useAppDispatch();
  const todosCount = useAppSelector(selectCount);
  const todos = useAppSelector(selectToDos);
  const [inputState, setInputState] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inputState) return;
    dispatch(addTodo(inputState));
    setInputState("");
  }

  return (
    <section className="flex h-full w-full flex-col items-center gap-4">
      <form
        className="flex items-center gap-2"
        action=""
        onSubmit={handleSubmit}
      >
        <Input
          value={inputState}
          name="todo"
          onChange={(e) => setInputState(e.currentTarget.value)}
          color="neutral"
          placeholder="Add Todo"
          size="lg"
          variant="outlined"
          sx={{ width: 400 }}
        />
        <IconButton
          className="h-10 w-10"
          size="md"
          type="submit"
          variant="soft"
        >
          <Plus className="h-6 w-6" />
        </IconButton>
      </form>
      <div className="flex flex-col gap-6 rounded-lg bg-stone-300 p-3 ">
        {todosCount > 0 ? (
          <>
            {todosCount > 0 && (
              <Button
                variant="solid"
                color="danger"
                onClick={() => dispatch(clearAllTodos())}
              >
                Delete All Todos
              </Button>
            )}
            {todos.map((todo, i) => (
              <Todo key={todo.cratedAt} todo={todo} i={i} />
            ))}
          </>
        ) : (
          <Typography level="h4">No Todos found.</Typography>
        )}
      </div>
    </section>
  );
};

export default function Todo({
  todo,
  i,
}: {
  todo: z.infer<typeof todoSchema>[0];
  i: number;
}) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [inputContent, setInputContent] = useState(todo.value);

  function handleEditSubmit() {
    dispatch(
      updateTodoContent({
        index: i,
        newContent: inputContent,
      }),
    );
    setIsEditing((oldState) => !oldState);
  }

  return (
    <div className={`flex min-w-[400px] items-center justify-between gap-2`}>
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => {
          if (isEditing) return;
          dispatch(toggleTodoIsDoneStatus(i));
        }}
      >
        <Checkbox
          className="self-start py-1"
          // onChange={() => dispatch(toggleTodoIsDoneStatus(i))}
          variant="plain"
          size="lg"
          checked={todo.isDone}
          disabled={isEditing}
        />
        {isEditing ? (
          <Input
            value={inputContent}
            name="editTodo"
            onChange={(e) => setInputContent(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSubmit();
            }}
            color="neutral"
            placeholder="Add Todo"
            size="lg"
            variant="outlined"
            sx={{ width: 400 }}
          />
        ) : (
          <p
            className={`inline-block max-w-[400px] hyphens-auto break-words text-xl font-medium ${todo.isDone ? "line-through opacity-80" : ""}`}
          >
            {todo.value}
          </p>
        )}
      </div>
      <div className="space-x-2">
        <IconButton
          className="ms-auto justify-self-end"
          variant="solid"
          color={isEditing ? "success" : "neutral"}
          size="sm"
          onClick={handleEditSubmit}
        >
          {isEditing ? (
            <Check className="p-[1px]" />
          ) : (
            <Edit className="p-[1px]" />
          )}
        </IconButton>
        <IconButton
          className="ms-auto justify-self-end"
          variant="solid"
          color="danger"
          size="sm"
          onClick={() => dispatch(deleteTodo(i))}
        >
          <Trash className="p-[1px]" />
        </IconButton>
      </div>
    </div>
  );
}
