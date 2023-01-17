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
  const { data, isLoading, error } = useSWR<ListTodosQuery>(
    listTodosQuery,
    fetcher,
    { revalidateOnFocus: false }
  );

  console.log("data", data);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className={styles.redText}>{error}</div>;
  return (
    <>
      {data &&
        data.todos.data.map((todo) => (
          <div key={todo.id}>
            No.{todo.id} {todo.title}
          </div>
        ))}
    </>
  );
};
