import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddTodoForm({ isLoading }) {
  const queryClient = useQueryClient();
  const formRef = useRef(null);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/todos/create", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      formRef.current?.reset();
    },
    onError: (error) => console.log(error),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (!data.title) return;

    const formattedData = { ...data, isCompleted: 0 };

    createMutation.mutate(formattedData);
  };

  return (
    <form
      ref={formRef}
      className="mb-4 flex gap-2 rounded-lg border bg-white px-3"
      onSubmit={onSubmit}
    >
      <div className="flex-1">
        <input
          required
          name="title"
          placeholder="Todo Title"
          className="w-full py-2 focus:outline-none"
          disabled={createMutation.isPending || isLoading}
        />
      </div>

      <button
        type="submit"
        className="shrink-0 px-2 font-semibold text-[#007AFF] active:opacity-50 disabled:text-neutral-500"
        disabled={createMutation.isPending || isLoading}
      >
        {createMutation.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
