import { gql, request } from "graphql-request";
import useSWR from "swr";

type ListTodosQuery = {
  todos: {
    __typename: "TodosPage";
    data: Array<{
      __typename: "Todo";
      id: string;
      title: string;
      completed: boolean;
    }>;
  };
};

export const listTodosQuery = gql`
  query {
    todos {
      __typename
      data {
        __typename
        id
        title
        completed
      }
    }
  }
`;

const fetcher = (query: string) =>
  request("https://graphqlzero.almansi.me/api", query);

export const TodoList = () => {
  const { data, error } = useSWR<ListTodosQuery>(listTodosQuery, fetcher);
  console.log("data", data);
  return (
    <ul>
      {data &&
        data.todos.data.map((todo) => (
          <li key={todo.id}>
            No.{todo.id} {todo.title}
          </li>
        ))}
    </ul>
  );
};
