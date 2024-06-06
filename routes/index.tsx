import type { Handlers } from "$fresh/server.ts";
import { getSession } from "../utils/oauth.ts";

import Hero from "../components/Hero.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const session = await getSession(req);

    if (!session) {
      return ctx.render();
    }

    return new Response(null, {
      status: 307,
      headers: {
        'Location': ctx.basePath + '/dashboard'
      }
    })
  },
};

export default function Home() {
  return (
    <div class="w-full h-screen px-1 py-1 lg:px-4 lg:py-8 mx-auto flex items-center justify-center">
      <Hero />
    </div>
  );
}
