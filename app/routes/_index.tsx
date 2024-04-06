import type { MetaFunction } from "@remix-run/node";
import ActionBar from "~/components/features/actionbar";
import Topbar from "~/components/features/topbar";

export const meta: MetaFunction = () => {
  return [
    { title: "GyozAI" },
    { name: "description", content: "Chat around, find out. Defi made simple." },
  ];
};

export default function Index() {
  return (
    <div>
      <Topbar />
      <ActionBar />
    </div>
  );
}
