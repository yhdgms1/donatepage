import type { Session } from '@auth/core/types'
import type { Handlers } from "$fresh/server.ts";
import { getUser, getPayMethods } from "../../utils/kv.ts";
import { getSession } from "../../utils/oauth.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const session = await getSession(req) as Session & {
      userId: string;
    }

    if (!session) {
      return ctx.renderNotFound()
    }
    
    const userId = session.userId;

    if (!userId) {
      return ctx.renderNotFound()
    }

    const user = await getUser(userId);

    if (user === 'NOT_FOUND') {
      return ctx.renderNotFound()
    }

    const payMethods = await getPayMethods(user.handle);

    if (payMethods === 'NOT_FOUND') {
      return ctx.renderNotFound();
    }
    
    return new Response(JSON.stringify(payMethods), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
};