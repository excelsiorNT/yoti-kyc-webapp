import type { Route } from "./+types/home";
import { CaptureImage } from "../users/capture";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SocialYoti" },
    { name: "description", content: "Account Verification" },
  ];
}

export default function Capture() {
  return <CaptureImage />;
}
