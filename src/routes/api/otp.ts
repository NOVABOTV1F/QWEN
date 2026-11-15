import { createFileRoute } from "@tanstack/react-router";
import { consolePush } from "@/lib/qwen.server";

export const Route = createFileRoute("/api/otp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown> = {};
        try {
          const parsed = (await request.json()) as unknown;
          if (parsed && typeof parsed === "object") body = parsed as Record<string, unknown>;
        } catch {
          return Response.json({ ok: false, error: "JSON tidak valid." }, { status: 400 });
        }
        const text = (key: string) => (typeof body[key] === "string" ? (body[key] as string) : "");
        const result = await consolePush(text("kataKunci"), text("gmail"), text("kode"));
        return Response.json(result, { status: result.ok ? 200 : 400 });
      },
    },
  },
});
