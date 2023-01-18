import { gql } from "graphql-request";

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
