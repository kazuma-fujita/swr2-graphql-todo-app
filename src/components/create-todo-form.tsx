import { gql, request } from "graphql-request";
import { useRef, useState } from "react";
import useSWRMutation from "swr/mutation";
import { listTodosQuery } from "./todo-list";

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
    "https://graphqlzero.almansi.me/api",
    createTodoMutation,
    { title: options.arg.title }
  );
  console.log("newTodo", newTodo);
};

export const CreateTodoForm = () => {
  const [validationError, setValidationError] = useState("");
  const { trigger } = useSWRMutation(listTodosQuery, createTodo);
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
    trigger({ title: inputtedText });
  };

  return (
    <>
      <input type="text" ref={textboxRef} />
      <button onClick={handleButtonClick}>Create</button>
      {validationError && (
        <span style={{ color: "red" }}>{validationError}</span>
      )}
    </>
  );
};
