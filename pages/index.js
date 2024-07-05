import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";

// Components
import AddTodoForm from "@/components/add-todo-form";
import TodoItem from "@/components/todo-item";

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch("/api/todos");
      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },
  });

  const onLogout = () => {
    deleteCookie("ckWebAuthToken");
    window.location.reload();
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError, error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">SwiftDataTodo (Next.js)</h1>
        <button
          className="rounded-lg border bg-white px-2 py-1"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>

      <AddTodoForm isLoading={isLoading} />

      <div className="mt-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : data.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            {data.map((todo, index) => (
              <TodoItem
                key={todo.id}
                isFirstItem={index === 0}
                isLastItem={index === data.length - 1}
                todo={todo}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
