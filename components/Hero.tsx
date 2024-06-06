export default function Hero() {
  return (
    <>
      <svg viewBox="0 0 200 200" class="fixed w-screen h-screen -z-[1] -top-1/2 lg:-right-1/3 lg:-top-1/3">
        <path fill="#e2bbff" d="M42.8,-58.7C53.5,-51.2,58.8,-36,65.4,-20.2C71.9,-4.4,79.8,12,75.7,24.7C71.7,37.3,55.9,46.2,41.3,56.7C26.7,67.2,13.3,79.3,-3.1,83.5C-19.4,87.7,-38.9,84,-50.2,72.4C-61.4,60.8,-64.6,41.4,-67.1,24C-69.7,6.7,-71.7,-8.6,-69.8,-25.2C-67.9,-41.8,-62.2,-59.7,-49.9,-66.7C-37.6,-73.7,-18.8,-69.7,-1.4,-67.8C16.1,-65.9,32.1,-66.1,42.8,-58.7Z" transform="translate(100 100)" />
      </svg>

      <div class="max-w-full lg:max-w-5xl flex flex-col gap-6">
        <h1 class="text-2xl lg:text-8xl font-bold select-none">
          Create <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-sky-500">your</span> personal <br /> donation page
        </h1>

        <div>
          <a
            class="inline-block bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 lg:px-14 lg:py-4 font-bold text-xl lg:text-3xl text-white rounded-md cursor-pointer select-none"
            href="/auth/signin"
          >
            Get started
          </a>
        </div>
      </div>
    </>
  )
}