import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Server,
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { http } from "@/lib/http";
import { userService, type User } from "@/services/userService";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();

  const [apiName, setApiName] = useState("unknown");
  const [isApiLoading, setIsApiLoading] = useState(false);

  // CRUD UI state
  const [newUserName, setNewUserName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setNewUserName("");
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
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToDelete(null);
    },
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const fetchApiName = () => {
    setIsApiLoading(true);
    http
      .get("name")
      .json<{ message: string; data: { name: string } }>()
      .then((response) => setApiName(response.data.name))
      .catch(() => setApiName("failed to fetch"))
      .finally(() => setIsApiLoading(false));
  };

  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    createMutation.mutate({ name: newUserName.trim() });
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditingName(user.name);
  };

  const saveEdit = (id: number) => {
    if (!editingName.trim()) return;
    updateMutation.mutate({ id, name: editingName.trim() });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
  };

  const executeDelete = () => {
    if (!userToDelete) return;
    deleteMutation.mutate(userToDelete.id);
  };

  return (
    <div className="min-h-screen selection:bg-emerald-500/30 flex flex-col relative">
      <main className="grow flex flex-col items-center pt-24 pb-20 px-6 text-center">
        <div className="mb-14">
          <div className="w-28 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <span className="text-3xl font-bold text-emerald-400">BHVR</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            Unified <span className="text-emerald-400">BHVR Dashboard</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Built with React + TanStack Router for UI navigation, TanStack Query
            for server-state management, Hono API endpoints on the backend, D1
            database and Cloudflare Workers as the edge runtime.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <a
              href="https://deploy.workers.cloudflare.com/?url=https://github.com/ZulfiFazhar/bhvr-template"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center rounded-xl px-2 py-2 transition-transform duration-300"
            >
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-orange-400/50 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-orange-300/20 transition-colors duration-300" />
              <img
                src="https://deploy.workers.cloudflare.com/button"
                alt="deploy to cloudflare workers"
                className="relative z-10"
              />
            </a>
          </div>
        </div>

        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <Server className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">API </h2>
            </div>

            <p className="text-zinc-400 mb-4 text-sm">
              Fetch data from the edge API and inspect live state.
            </p>

            <button
              onClick={fetchApiName}
              disabled={isApiLoading}
              className="w-full bg-emerald-500 text-black px-4 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isApiLoading ? "Fetching..." : "Get API Name"}
            </button>

            <div className="h-full mt-4 rounded-lg bg-black/40 border border-emerald-500/20 flex flex-col items-center justify-center gap-4">
              <span className="text-zinc-400 text-sm">Response:</span>
              <span className="text-emerald-400 font-mono font-medium">
                {apiName}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Status</h2>
            </div>

            <p className="text-zinc-400 mb-6 text-sm">
              Quick runtime indicators for query and mutation activity.
            </p>

            <div className="space-y-3 mt-auto">
              <div className="p-4 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Users loaded</span>
                <span className="text-emerald-400 font-mono font-medium">
                  {users.length}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Query loading</span>
                <span className="text-emerald-400 font-mono font-medium">
                  {String(usersLoading)}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Mutation pending</span>
                <span className="text-emerald-400 font-mono font-medium">
                  {String(isMutating)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                User Management
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <input
                type="text"
                placeholder="Enter user name..."
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
                className="bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white flex-1 focus:outline-none focus:border-emerald-500/50 transition-colors"
                disabled={isMutating}
              />
              <button
                onClick={handleAddUser}
                disabled={!newUserName.trim() || isMutating}
                className="bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>

            <div className="space-y-3">
              {usersLoading ? (
                <div className="text-center py-8 text-zinc-400 border border-dashed border-white/10 rounded-xl">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 border border-dashed border-white/10 rounded-xl">
                  No users found. Add one above.
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 gap-4"
                  >
                    {editingId === user.id ? (
                      <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && saveEdit(user.id)
                          }
                          autoFocus
                          className="bg-black/40 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-white flex-1 focus:outline-none focus:border-emerald-500"
                          disabled={isMutating}
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          #{user.id} - {user.name}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {editingId === user.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(user.id)}
                            disabled={isMutating || !editingName.trim()}
                            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={isMutating}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(user)}
                            disabled={isMutating}
                            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(user)}
                            disabled={isMutating}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete User</h3>
            </div>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-white">{userToDelete.name}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="w-full px-4 py-2 rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
                disabled={isMutating}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="w-full px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isMutating}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
