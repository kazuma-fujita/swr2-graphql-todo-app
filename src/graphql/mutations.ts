import { gql } from "graphql-request";

export const createTodoMutation = gql`
  mutation CreateTodo($title: String!) {
    createTodo(input: { title: $title, completed: false }) {
      id
      title
      completed
    }
  }
`;

export const updateTodoMutation = gql`
  mutation UpdateTodo($id: ID!, $title: String!, $completed: Boolean!) {
    updateTodo(id: $id, input: { title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`;
