import type { Route } from "./+types/home";
import Registration from "../users/registration";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SocialYoti" },
    { name: "description", content: "Register a new account" },
  ];
}

export default function Register() {
  return <Registration />;
}
