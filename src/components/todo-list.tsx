import { gql, request } from "graphql-request";
import useSWR from "swr";
import styles from "../../styles/Home.module.css";

export const graphqlEndpoint = "https://graphqlzero.almansi.me/api";

export type ListTodosQuery = {
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
    <>
      {error && <span className={styles.redText}>{error}</span>}
      {data &&
        data.todos.data.map((todo) => (
          <div key={todo.id}>
            No.{todo.id} {todo.title}
          </div>
        ))}
    </>
  );
};
