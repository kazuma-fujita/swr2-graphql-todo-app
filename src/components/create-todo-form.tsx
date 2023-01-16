import { gql, request } from "graphql-request";
import { useRef, useState } from "react";
import useSWRMutation from "swr/mutation";
import { graphqlEndpoint, ListTodosQuery, listTodosQuery } from "./todo-list";

const createTodoMutation = gql`
  mutation CreateTodo($title: String!) {
    createTodo(input: { title: $title, completed: false }) {
      id
      title
      completed
    }
  }
`;

const createTodo = async (key: string, options: { arg: { title: string } }) => {
  const newTodo = await request(
    graphqlEndpoint,
    createTodoMutation,
    options.arg
  );
  console.log("newTodo", newTodo);
  return newTodo;
};

export const CreateTodoForm = () => {
  const [validationError, setValidationError] = useState("");
  const { trigger, isMutating } = useSWRMutation(listTodosQuery, createTodo);
  const textboxRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (!textboxRef || !textboxRef.current) {
      return;
    }
    const inputtedText = textboxRef.current.value;
    console.log("inputData", inputtedText);
    if (!inputtedText) {
      setValidationError("Title field is required.");
      return;
    }
    trigger(
      { title: inputtedText },
      {
        optimisticData: (data: ListTodosQuery) =>
          ({
            todos: {
              data: [
                ...data.todos.data,
                {
                  id: `${data.todos.data.length + 1}`,
                  title: inputtedText,
                  completed: false,
                },
              ],
            },
          } as ListTodosQuery),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  };

  return (
    <div>
      <input type="text" ref={textboxRef} />
      <button onClick={handleButtonClick} disabled={isMutating}>
        Create
      </button>
      {validationError && (
        <span style={{ color: "red" }}>{validationError}</span>
      )}
    </div>
  );
};
