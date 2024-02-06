import { Button } from "@mui/material";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
};

const App = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/todo");
        const todo: Todo[] = await response.json();
        setTodo(todo);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTodo();
  }, []);

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setTitle(todo.title);
  };

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      });

      const newTodoItem = await response.json();
      setTodo([newTodoItem, ...todo]);
      setTitle("");
      console.log(newTodoItem);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatedTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTodo) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/todo/${selectedTodo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
          }),
        }
      );

      const updatedTodo = await response.json();

      const updatedTodoList = todo.map((todo) =>
        todo.id === selectedTodo.id ? updatedTodo : todo
      );

      setTodo(updatedTodoList);
      setTitle("");
      setSelectedTodo(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (e: React.MouseEvent, todoId: number) => {
    e.stopPropagation();

    try {
      const response = await fetch(`http://localhost:5000/api/todo/${todoId}`, {
        method: "DELETE",
      });

      const updatedTodo = todo.filter((todo) => todo.id !== todoId);
      setTodo(updatedTodo);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <form
        className="p-4 flex"
        onSubmit={(e) =>
          selectedTodo ? handleUpdatedTodo(e) : handleAddTodo(e)
        }
      >
        <label className="text-gray-700 p-3">To do:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="myInput"
          className="w-auto border border-gray-300 p-2 rounded-md focus:outline-none focus:border-gray-500 mr-4 md:w-96"
        />
        {selectedTodo ? (
          <Button type="submit" variant="outlined" className="h-12 w-24">
            Save
          </Button>
        ) : (
          <Button type="submit" variant="outlined" className="h-12 w-24">
            Add
          </Button>
        )}
      </form>
      <div className="flex p-4 md:flex">
        <ul>
          {todo.map((item) => (
            <div key={item.id} className="flex p-2">
              <li className="bg-gray-200 w-52 h-14 flex items-center justify-center mb-2 rounded-md md:w-80 ">
                {item.title}
              </li>
              <button
                onClick={() => handleTodoClick(item)}
                type="submit"
                className="h-14 w-14 ml-2 border-2 border-sky-500 rounded-md text-sky-500 hover:bg-sky-100 md:w-20"
              >
                Edit
              </button>
              <button
                type="submit"
                className="h-14 w-14 ml-2 border-2 border-rose-500 rounded-md text-rose-500 hover:bg-rose-100 md:w-20"
                onClick={(e) => deleteTodo(e, item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
