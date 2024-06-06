import type { Session } from '@auth/core/types'
import type { Handlers, PageProps } from "$fresh/server.ts";
import { getSession } from "../utils/oauth.ts";
import { getPayMethods, getUser } from "../utils/kv.ts";
import PayingSetup from "../islands/PayingSetup.tsx";
import { PayMethod } from "../utils/pay_methods.ts";

type Data = {
  name: string;
  image: string;

  handle: string;

  methods: PayMethod[]
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const session = await getSession(req) as Session & {
      userId: string;
    }

    if (!session || !session.user || !session.userId) {
      return new Response(null, {
        status: 307,
        headers: {
          'Location': '/'
        }
      })
    }

    const user = await getUser(session.userId);

    if (user === 'NOT_FOUND') {
      return new Response(null, {
        status: 307,
        headers: {
          'Location': '/'
        }
      })
    }

    const methods = await getPayMethods(user.handle);
    
    return ctx.render({
      ...session.user,
      handle: user.handle,
      methods: methods === 'NOT_FOUND' ? [] : methods
    });
  },
};

export default function Dashboard({ data }: PageProps<Data>) {
  return (
    <>
      <div class="w-full flex gap-2 items-center justify-between p-4 shadow-sm flex-wrap">
        <div class="flex gap-2 items-center">
          <h2 class="text-xl font-semibold">Dashboard</h2>
          <div class="hidden lg:flex gap-2">
            •
            <span class="font-light">{data.name}</span>
          </div>
        </div>

        <div class="flex gap-2 items-center">
          <img class="rounded-full w-8 h-8 border-solid border-[#e2bbff] border-2" alt="" src={data.image} />

          <a class="hover:underline" href="/auth/signout">
            Sign out
          </a>
        </div>
      </div>

      <div class="w-full min-h-[calc(100vh_-_4rem)] px-1 py-1 lg:px-4 lg:py-8 mx-auto flex justify-center">
        <div class="w-full max-w-full lg:max-w-5xl flex flex-col gap-6">
          <PayingSetup handle={data.handle} methods={data.methods} />
        </div>
      </div>
    </>
  );
}