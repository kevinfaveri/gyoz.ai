import type { MetaFunction } from "@remix-run/node";
import ActionBar from "~/components/features/actionbar";

export const meta: MetaFunction = () => {
  return [
    { title: "GyozAI" },
    { name: "description", content: "Chat around, find out. Defi made simple." },
  ];
};

export default function Index() {
  return (
    <div>
      <ActionBar />
    </div>
  );
}
