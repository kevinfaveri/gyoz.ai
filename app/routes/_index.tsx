import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Theme, Themed, useTheme } from "~/utils/theme-provider";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
  };

  return (
    <div>
      Welcome to gyoz.ai! 
      <Button onClick={toggleTheme}>Click me!</Button>
      <Themed
        dark={<h1 className="dark-component">I'm only seen in dark mode</h1>}
        light={<h1 className="light-component">I'm only seen in light mode</h1>}
      />
    </div>
  );
}
