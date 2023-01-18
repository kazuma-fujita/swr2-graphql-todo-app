import { request } from "graphql-request";
import { useRef, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import styles from "../../styles/Home.module.css";
import { displayError } from "../functions/utils";
import { graphqlEndpoint, ListTodos } from "../graphql/API";
import { updateTodoMutation } from "../graphql/mutations";
import { listTodosQuery } from "../graphql/queries";

const fetcher = (query: string) =>
  request(graphqlEndpoint, query, { page: 1, limit: 5 });

const updateTodo = async (
  key: string,
  options: { arg: { id: string; title: string; completed: boolean } }
) => {
  const updatedTodo = await request(
    graphqlEndpoint,
    updateTodoMutation,
    options.arg
  );
  return updatedTodo;
};

export const TodoList = () => {
  const {
    data,
    isLoading,
    error: fetchError,
  } = useSWR<ListTodos>(listTodosQuery, fetcher, {
    revalidateOnFocus: false,
  });

  const {
    trigger,
    isMutating,
    error: updateError,
  } = useSWRMutation(listTodosQuery, updateTodo);

  const textboxRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState("");
  const [isActiveTextbox, setIsActiveTextbox] = useState<number | null>(null);

  const modifyTodo = async (id: string, title: string, completed: boolean) => {
    await trigger(
      { id: id, title: title, completed: completed },
      {
        optimisticData: (cache: ListTodos) =>
          ({
            todos: {
              data: cache.todos.data.map((todo) =>
                todo.id === id
                  ? {
                      ...todo,
                      title: title,
                      completed: completed,
                    }
                  : todo
              ),
            },
          } as ListTodos),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  };

  const onTitleClick = (index: number) => {
    setIsActiveTextbox(index);
  };

  const onButtonClick = async (id: string, completed: boolean) => {
    if (!textboxRef || !textboxRef.current) {
      return;
    }

    const inputtedText = textboxRef.current.value;
    setValidationError("");
    if (!inputtedText) {
      setValidationError("Title field is required.");
      return;
    }

    await modifyTodo(id, inputtedText, completed);
    setIsActiveTextbox(null);
  };

  const onCheckboxClick = async (
    id: string,
    title: string,
    completed: boolean
  ) => {
    await modifyTodo(id, title, completed!);
  };

  if (isLoading) return <div>Loading...</div>;
  if (fetchError)
    return <div className={styles.redText}>{displayError(fetchError)}</div>;
  if (updateError)
    return <div className={styles.redText}>{displayError(updateError)}</div>;
  return (
    <>
      {data &&
        data.todos.data.map((todo, index) => (
          <div key={todo.id}>
            <input
              type="checkbox"
              defaultChecked={todo.completed}
              onClick={() =>
                onCheckboxClick(todo.id, todo.title, todo.completed)
              }
              disabled={isMutating}
            />
            No.{todo.id}{" "}
            {index === isActiveTextbox ? (
              <>
                <input type="text" defaultValue={todo.title} ref={textboxRef} />
                <button
                  onClick={() => onButtonClick(todo.id, todo.completed)}
                  disabled={isMutating}
                >
                  Update Todo
                </button>
                {validationError && (
                  <span className={styles.redText}>{validationError}</span>
                )}
              </>
            ) : (
              <span onClick={() => onTitleClick(index)}>{todo.title}</span>
            )}
          </div>
        ))}
    </>
  );
};
