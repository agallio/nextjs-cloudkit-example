import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function TodoItem({ isFirstItem, isLastItem, todo }) {
  const queryClient = useQueryClient();

  const [editable, setEditable] = useState(false);
  const [prevIsCompleted, setPrevIsCompleted] = useState(todo.isCompleted);
  const [isCompleted, setIsCompleted] = useState(todo.isCompleted);

  // Updating state based on props.
  // https://react.dev/learn/you-might-not-need-an-effect
  if (todo.isCompleted !== prevIsCompleted) {
    setPrevIsCompleted(todo.isCompleted);
    setIsCompleted(todo.isCompleted);
  }

  const formRef = useRef(null);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/todos/update`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      formRef.current?.reset();
      setEditable(false);
    },
    onError: (error) => console.log(error),
  });

  const deleteMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/todos/delete`, {
        method: "DELETE",
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => console.log(error),
  });

  const onUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (!data.title) return;

    const formattedData = {
      ...data,
      id: todo.id,
      recordChangeTag: todo.recordChangeTag,
      isCompleted: todo.isCompleted,
    };

    updateMutation.mutate(formattedData);
  };

  const onCheckboxUpdate = (e) => {
    setIsCompleted(e.target.checked);

    updateMutation.mutate({ ...todo, isCompleted: e.target.checked });
  };

  const onDelete = () => {
    deleteMutation.mutate({
      id: todo.id,
      recordChangeTag: todo.recordChangeTag,
    });
  };

  return (
    <div
      className={`flex items-center justify-between bg-white px-3 py-2 ${
        isFirstItem ? "border-b" : isLastItem ? "border-none" : "border-b"
      }`}
    >
      <div>
        <form
          ref={formRef}
          onSubmit={onUpdate}
          className="flex items-center gap-2"
        >
          {editable ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="title"
                defaultValue={todo.title}
                className="rounded border px-2 py-1"
                disabled={updateMutation.isPending || deleteMutation.isPending}
              />
            </div>
          ) : (
            <>
              <input
                type="checkbox"
                checked={isCompleted}
                className="h-6 w-6"
                onChange={onCheckboxUpdate}
                disabled={updateMutation.isPending || deleteMutation.isPending}
              />
              <p>{todo.title}</p>
            </>
          )}
        </form>
      </div>

      <div className="flex items-center gap-2">
        {editable ? (
          <>
            <button
              className="rounded border px-2 py-1"
              onClick={() =>
                // Trigger form submit outside the form.
                formRef.current?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                )
              }
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </button>
            <button
              className="rounded border px-2 py-1"
              onClick={() => setEditable(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="rounded border px-2 py-1"
              disabled={deleteMutation.isPending}
              onClick={() => setEditable(true)}
            >
              Edit
            </button>
            <button
              className="rounded border px-2 py-1 text-red-500"
              disabled={deleteMutation.isPending}
              onClick={onDelete}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
