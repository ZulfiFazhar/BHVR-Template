import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "@/assets/Cloudflare_Logo.svg";
import honoLogo from "@/assets/hono.svg";
import { http } from "@/lib/http";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-8 py-8 text-center">
        <div className="flex justify-center items-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" className="group">
            <img
              src={viteLogo}
              className="h-32 p-6 transition-all duration-300 will-change-transform group-hover:drop-shadow-[0_0_2em_#646cffaa]"
              alt="Vite logo"
            />
          </a>
          <a href="https://react.dev" target="_blank" className="group">
            <img
              src={reactLogo}
              className="h-32 p-6 transition-all duration-300 will-change-transform group-hover:drop-shadow-[0_0_2em_#61dafbaa] motion-safe:animate-[spin_20s_linear_infinite]"
              alt="React logo"
            />
          </a>
          <a href="https://hono.dev/" target="_blank" className="group">
            <img
              src={honoLogo}
              className="h-32 p-6 transition-all duration-300 will-change-transform group-hover:drop-shadow-[0_0_2em_#f6821faa]"
              alt="Hono logo"
            />
          </a>
          <a
            href="https://workers.cloudflare.com/"
            target="_blank"
            className="group"
          >
            <img
              src={cloudflareLogo}
              className="h-32 p-6 transition-all duration-300 will-change-transform group-hover:drop-shadow-[0_0_2em_#f6821faa]"
              alt="Cloudflare logo"
            />
          </a>
        </div>

        <h1 className="text-5xl leading-tight mb-8">
          Vite + React + Hono + Cloudflare
        </h1>

        <div className="p-8">
          <button
            onClick={() => setCount((count) => count + 1)}
            aria-label="increment"
            className="rounded-lg border border-zinc-700 dark:border-zinc-300 px-5 py-2.5 text-base font-medium bg-zinc-800 dark:bg-zinc-200 text-white cursor-pointer transition-all duration-250 hover:border-blue-500 focus:outline focus:outline-blue-500"
          >
            count is {count}
          </button>
          <p className="mt-4">
            Edit{" "}
            <code className="bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 px-1 rounded">
              src/routes/index.tsx
            </code>{" "}
            and save to test HMR
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-2 p-8">
          <button
            onClick={() => {
              http
                .get("name")
                .json<{ name: string }>()
                .then((data) => setName(data.name));
            }}
            aria-label="get name"
            className="rounded-lg border border-zinc-700 dark:border-zinc-300 px-5 py-2.5 text-base font-medium bg-zinc-800 dark:bg-zinc-200 text-white cursor-pointer transition-all duration-250 hover:border-blue-500 focus:outline focus:outline-blue-500 w-fit"
          >
            Name from API is: {name}
          </button>

          <button className="w-fit">
            <Link to="/user">Go to User Page</Link>
          </button>

          <p className="mt-4">
            Edit{" "}
            <code className="bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 px-1 rounded">
              server/index.ts
            </code>{" "}
            to change the name
          </p>
        </div>

        <p className="text-gray-500 dark:text-gray-400">
          Click on the logos to learn more
        </p>
      </div>
    </div>
  );
}
