"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import z from "zod";
import {
  addTodo,
  deleteTodo,
  selectTodos,
  updateTodoContent,
  toggleTodoIsDoneStatus,
  clearAllTodos,
  setInitialTodoState,
} from "@/lib/features/todos/todosSlice";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  Skeleton,
  Typography,
} from "@mui/joy";
import { Check, Edit, Plus, Trash } from "lucide-react";
import { todoSchema } from "@/lib/zodSchemas";

export const ToDos = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const [isInitializing, setIsInitializing] = useState(true);
  const [inputState, setInputState] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inputState) return;
    dispatch(addTodo(inputState));
    setInputState("");
  }

  const todoArray = useMemo(() => {
    const tempTodoArray: Array<z.infer<typeof todoSchema>[0] & { id: string }> =
      [];
    for (const key in todos) {
      tempTodoArray.push({ ...todos[key], id: key });
    }
    return tempTodoArray;
  }, [todos]);

  const completedTodos = useMemo(
    () => todoArray.filter((todo) => todo.isDone),
    [todoArray],
  );
  const ongoingTodos = useMemo(
    () => todoArray.filter((todo) => !todo.isDone),
    [todoArray],
  );

  useEffect(() => {
    const todosFromStorage: z.infer<typeof todoSchema> | null =
      localStorage.getItem("todos")
        ? JSON.parse(localStorage.getItem("todos")!)
        : null;

    if (todosFromStorage && todoSchema.safeParse(todosFromStorage).success) {
      dispatch(setInitialTodoState(todosFromStorage));
    }
    setIsInitializing(false);
  }, []);

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
          sx={{ width: 300 }}
        />
        <IconButton
          className="h-10 w-10"
          size="md"
          type="submit"
          variant="solid"
        >
          <Plus className="h-6 w-6" />
        </IconButton>
      </form>
      {!isInitializing ? (
        <div className="flex min-w-[300px] flex-col gap-5 rounded-lg bg-stone-300 p-3">
          {todoArray.length > 0 ? (
            <>
              {todoArray.length > 0 && (
                <Button
                  variant="solid"
                  color="danger"
                  onClick={() => dispatch(clearAllTodos())}
                >
                  Delete All Todos
                </Button>
              )}
              {ongoingTodos.length > 0 && (
                <>
                  <Typography level="h2">Ongoing</Typography>
                  {ongoingTodos.map((todo) => (
                    <Todo key={todo.id} todo={todo} />
                  ))}
                </>
              )}
              {completedTodos.length > 0 && (
                <>
                  <Typography level="h2">Completed</Typography>
                  {completedTodos.map((todo) => (
                    <Todo key={todo.id} todo={todo} />
                  ))}
                </>
              )}
            </>
          ) : (
            <Typography sx={{ margin: "auto" }} level="h3">
              No Todos found.
            </Typography>
          )}
        </div>
      ) : (
        <div className="flex min-w-[300px] flex-col gap-5 rounded-lg bg-stone-300 p-3">
          <div className="h-10 w-full animate-pulse rounded-lg bg-stone-500" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-stone-500" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-stone-500" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-stone-500" />
        </div>
      )}
    </section>
  );
};

export default function Todo({
  todo,
}: {
  todo: z.infer<typeof todoSchema>[0] & { id: string };
}) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [inputContent, setInputContent] = useState(todo.value);

  function handleEditSubmit() {
    dispatch(
      updateTodoContent({
        id: todo.id,
        newContent: inputContent,
      }),
    );
    setIsEditing((oldState) => !oldState);
  }

  return (
    <div className={`flex min-w-[300px] items-center justify-between gap-2`}>
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={() => {
          if (isEditing) return;
          dispatch(toggleTodoIsDoneStatus(todo.id));
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
            sx={{ width: 300 }}
          />
        ) : (
          <p
            className={`inline-block max-w-[300px] hyphens-auto break-words text-xl font-medium ${todo.isDone ? "line-through opacity-80" : ""}`}
          >
            {todo.value}
          </p>
        )}
      </div>
      <div className="space-x-2">
        <IconButton
          variant="solid"
          color={isEditing ? "success" : "neutral"}
          size="sm"
          onClick={handleEditSubmit}
          sx={{ justifySelf: "end" }}
        >
          {isEditing ? (
            <Check className="p-[1px]" />
          ) : (
            <Edit className="p-[1px]" />
          )}
        </IconButton>
        <IconButton
          className="ms-auto"
          variant="solid"
          color="danger"
          size="sm"
          onClick={() => dispatch(deleteTodo(todo.id))}
          sx={{ justifySelf: "end" }}
        >
          <Trash className="p-[1px]" />
        </IconButton>
      </div>
    </div>
  );
}
