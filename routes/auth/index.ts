import { Handler, RouteConfig } from "$fresh/server.ts";
import { Auth, authConfig } from "../../utils/oauth.ts";

export const handler: Handler = async (req) => {
  return await Auth(req, authConfig);
}

export const config: RouteConfig = {
  routeOverride: '/auth/*'
}