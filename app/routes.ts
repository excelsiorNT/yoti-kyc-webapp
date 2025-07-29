import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("registration", "routes/registration.tsx"),
    route("result", "routes/result.tsx"),
    route("verify", "routes/capture.tsx")
] satisfies RouteConfig;
