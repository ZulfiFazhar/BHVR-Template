import { createFileRoute, Link } from "@tanstack/react-router";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type User } from "@/services/userService";

export const Route = createFileRoute("/user")({
  component: UserPage,
});

function UserPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setName("");
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      userService.updateUser(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingId(null);
      setEditingName("");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  const loading =
    usersLoading ||
    createMutation.isPending ||
    deleteMutation.isPending ||
    updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    deleteMutation.mutate(id);
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditingName(user.name);
  };

  const handleUpdate = (id: number) => {
    if (!editingName.trim()) return;
    updateMutation.mutate({ id, name: editingName });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen py-2">
      <h1 className="text-4xl font-bold mb-4">User Page</h1>
      <p className="text-lg mb-2">Welcome to the user page!</p>
      <Link to="/" className="mb-8">
        Back to main Page
      </Link>

      <form onSubmit={handleSubmit} className="mb-8">
        <label htmlFor="name" className="flex gap-2 items-center">
          <span className="font-semibold">Name:</span>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user name"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </label>
      </form>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Users List</h2>
        {loading && users.length === 0 ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="border border-gray-200 rounded p-3 hover:bg-gray-50 hover:text-black flex justify-between items-center"
              >
                {editingId === user.id ? (
                  <>
                    <div className="flex gap-2 items-center flex-1">
                      <span className="font-semibold">#{user.id}</span>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mr-4"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(user.id)}
                        disabled={loading || !editingName.trim()}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold">#{user.id}</span> -{" "}
                      {user.name}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={loading}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
