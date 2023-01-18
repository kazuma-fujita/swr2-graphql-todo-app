import { request } from "graphql-request";
import { useRef, useState } from "react";
import useSWRMutation from "swr/mutation";
import styles from "../../styles/Home.module.css";
import { displayError } from "../functions/utils";
import { graphqlEndpoint, ListTodos } from "../graphql/API";
import { createTodoMutation } from "../graphql/mutations";
import { listTodosQuery } from "../graphql/queries";

const createTodo = async (key: string, options: { arg: { title: string } }) => {
  const newTodo = await request(
    graphqlEndpoint,
    createTodoMutation,
    options.arg
  );
  return newTodo;
};

export const CreateTodoForm = () => {
  const [validationError, setValidationError] = useState("");
  const { trigger, isMutating, error } = useSWRMutation(
    listTodosQuery,
    createTodo
  );
  const textboxRef = useRef<HTMLInputElement>(null);

  const addTodo = async (title: string) => {
    await trigger(
      { title: title },
      {
        optimisticData: (cache: ListTodos) =>
          ({
            todos: {
              data: [
                ...cache.todos.data,
                {
                  id: `${cache.todos.data.length + 1}`,
                  title: title,
                  completed: false,
                },
              ],
            },
          } as ListTodos),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  };

  const onButtonClick = async () => {
    if (!textboxRef || !textboxRef.current) {
      return;
    }

    const inputtedText = textboxRef.current.value;
    setValidationError("");
    if (!inputtedText) {
      setValidationError("Title field is required.");
      return;
    }

    await addTodo(inputtedText);
  };

  if (error) return <div className={styles.redText}>{displayError(error)}</div>;
  return (
    <>
      <input type="text" ref={textboxRef} />
      <button onClick={onButtonClick} disabled={isMutating}>
        Create Todo
      </button>
      {validationError && (
        <span className={styles.redText}>{validationError}</span>
      )}
    </>
  );
};
