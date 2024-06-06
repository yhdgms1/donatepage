import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>

      <div class="px-4 py-8 mx-auto">
        Yo 404
      </div>
    </>
  );
}
