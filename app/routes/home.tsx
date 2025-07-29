import type { Route } from "./+types/home";
import Registration from "../users/registration";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SocialYoti" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Registration />;
}
