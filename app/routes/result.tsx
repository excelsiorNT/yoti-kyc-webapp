import type { Route } from "./+types/home";
import Result from "../users/result";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SocialYoti" },
    { name: "description", content: "Verification Result" },
  ];
}

export default function Verification() {
  return <Result username={""} kycResult={""} />;
}
