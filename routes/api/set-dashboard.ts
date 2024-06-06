import type { PayMethod } from "../../utils/pay_methods.ts";
import type { Session } from '@auth/core/types'
import type { Handlers } from "$fresh/server.ts";
import { getUser, setPayMethods } from "../../utils/kv.ts";
import { getSession } from "../../utils/oauth.ts";
import { PayType } from "../../utils/pay_methods.ts";
import * as v from 'valibot';

const PaySchema = v.array(v.looseObject({
  type: v.enum_(PayType)
}))

const makeReturn = (success: boolean = false) => {
  return new Response(JSON.stringify({ success }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const session = await getSession(req) as Session & {
      userId: string;
    }

    if (!session) {
      return makeReturn()
    }
    
    const userId = session.userId;

    if (!userId) {
      return makeReturn()
    }

    const user = await getUser(userId);

    if (user === 'NOT_FOUND') {
      return makeReturn()
    }

    const json = await req.json();
    const result = v.safeParse(PaySchema, json);
    
    if (!result.success) {
      return makeReturn()
    }

    await setPayMethods(user.handle, result.output as PayMethod[])

    return makeReturn(true);
  },
};