import type { Metadata } from "next";
import { ToDos } from "./components/ToDos";

export default function Page() {
  return <ToDos />;
}

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple Todo App where you can create edit or delete Todos",
};
