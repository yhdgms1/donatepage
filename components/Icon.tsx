import type { JSX } from 'preact'

type IconProps = JSX.SVGAttributes<SVGSVGElement>;

const Icon = (props: IconProps) => {
  return (
    <svg width="24" height="24" class="text-gray-600" viewBox="0 0 256 256" {...props} />
  );
}

Icon.Pencil = () => {
  return (
    <>
      <path fill="none" d="M0 0h256v256H0z"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M96 216H48a8 8 0 0 1-8-8v-44.69a8 8 0 0 1 2.34-5.65L165.66 34.34a8 8 0 0 1 11.31 0L221.66 79a8 8 0 0 1 0 11.31ZM216 216H96M136 64l56 56"/>
    </>
  )
}

Icon.Add = () => {
  return (
    <>
      <path fill="none" d="M0 0h256v256H0z"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M40 128h176M128 40v176"/>
    </>
  )
}

Icon.Close = () => {
  return (
    <>
      <path fill="none" d="M0 0h256v256H0z"/>
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M200 56 56 200M200 200 56 56"/>
    </>
  )
}

Icon.Trash = () => {
  return (
    <>
      <path fill="none" d="M0 0h256v256H0z"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 56H40M104 104v64M152 104v64M200 56v152a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V56M168 56V40a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v16"/>
    </>
  )
}

Icon.Check = () => {
  return (
    <>
      <path fill="none" d="M0 0h256v256H0z"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m40 144 56 56L224 72"/>
    </>
  )
}

Icon.Share = () => {
  return (
    <>
      <path fill="none" d="M0 0h256v256H0z"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M30.93 198.72C47.39 181.19 90.6 144 152 144v48l80-80-80-80v48C99.2 80 31.51 130.45 24 195.54a4 4 0 0 0 6.93 3.18Z"/>
    </>
  )
}

Icon.Copy = () => {
  return (
    <>
      <path fill="none" d="M0 0h256v256H0z"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M160 40h40a8 8 0 0 1 8 8v168a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h40"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M88 72v-8a40 40 0 0 1 80 0v8Z"/>
    </>
  )
}

export { Icon }