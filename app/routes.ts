import {
  type RouteConfig,
  prefix,
  layout,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  index("./routes/home.ts"),
  layout("./layouts/AppLayout.tsx", [route("/app", "./routes/app.tsx")]),

  ...prefix("webhooks", [
    ...prefix("app", [
      route("uninstalled", "./routes/webhooks/app/uninstalled.ts"),
      route("scopes_update", "./routes/webhooks/app/scopes_update.ts"),
    ]),
  ]),

  ...prefix("auth", [
    route("/:platform/callback", "./routes/auth/platform-callback.ts"),
    route("login", "./routes/auth/login.tsx"),
    route("*", "./routes/auth/catch-all.ts"),
  ]),
] satisfies RouteConfig;
