import { gql, request } from "graphql-request";
import useSWR from "swr";

type TodoResult = {
  todos: Todos;
};

type Todos = {
  data: Todo[];
};

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const query = gql`
  query {
    todos {
      data {
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
  const { data, error } = useSWR<TodoResult>(query, fetcher);
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
