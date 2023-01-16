import { gql, request } from "graphql-request";
import useSWR from "swr";

export const graphqlEndpoint = "https://graphqlzero.almansi.me/api";

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
  query ($page: Int, $limit: Int) {
    todos(options: { paginate: { page: $page, limit: $limit } }) {
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
  request(graphqlEndpoint, query, { page: 1, limit: 5 });

export const TodoList = () => {
  const { data, error } = useSWR<ListTodosQuery>(listTodosQuery, fetcher);
  console.log("data", data);
  return (
    <div>
      {error && <span style={{ color: "red" }}>{error}</span>}
      <ul>
        {data &&
          data.todos.data.map((todo) => (
            <li key={todo.id}>
              No.{todo.id} {todo.title}
            </li>
          ))}
      </ul>
    </div>
  );
};
