import { Assistant } from "./assistant";

export default function Home() {
  return (
    <main className="flex min-h-screen h-dvh w-dvw flex-col items-center justify-center bg-transparent">
      {/* This renders your custom chat widget! */}
      <Assistant />
    </main>
  );
}