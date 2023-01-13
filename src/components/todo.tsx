import { CreateTodoForm } from "./create-todo-form";
import { TodoList } from "./todo-list";
import styles from "../../styles/Home.module.css";

export const Todo = () => {
  return (
    <>
      <div className={styles.description}>
        <CreateTodoForm />
        <TodoList />
      </div>
    </>
  );
};
