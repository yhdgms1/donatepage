import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import clsx from 'npm:clsx'

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={clsx('px-24 py-4 font-bold text-3xl text-white rounded-md cursor-pointer', props.class)}
    />
  );
}
