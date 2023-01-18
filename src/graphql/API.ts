export const graphqlEndpoint = "https://graphqlzero.almansi.me/api";

export type ListTodos = {
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
