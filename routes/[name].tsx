import type { PayMethod } from "../utils/pay_methods.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { getPayMethods } from "../utils/kv.ts";
import Card from "../islands/Card.tsx";

type PageData = {
  handle: string;
  payMethods: PayMethod[]
}

export const handler: Handlers = {
  async GET(_, ctx) {
    const { name } = ctx.params;

    if (name[0] !== '@') {
      return ctx.renderNotFound();
    }

    const handle = name.replace('@', '');
    const payMethods = await getPayMethods(handle);

    if (payMethods === 'NOT_FOUND') {
      return ctx.renderNotFound()
    }

    return ctx.render({
      handle,
      payMethods
    });
  },
};

export default function Route({ data }: PageProps<PageData>) {
  return (
    <>
      <head>
        <style>{`[data-qr] > canvas { width: 100%; height: 100%; }`}</style>
      </head>

      <div class="w-full min-h-screen flex flex-col items-center justify-start py-4">
        <div class="w-11/12 lg:w-3/12 flex flex-col gap-3">
          <h1 class="text-2xl font-semibold">Donate to @{data.handle}</h1>
        
          {data.payMethods.map(method => <Card method={method} />)}
        </div>
      </div>
    </>
  )
}