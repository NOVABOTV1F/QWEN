import { createFileRoute } from "@tanstack/react-router";
import { QwenApp } from "@/components/qwen-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <QwenApp />;
}
