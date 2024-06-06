/// <reference lib="deno.unstable" />

import type { PayMethod } from './pay_methods.ts'

const DENO_KV_PATH_KEY = "DENO_KV_PATH";
const permissionToGetPathToDB = await Deno.permissions.query({ name: "env", variable: DENO_KV_PATH_KEY });

const kv = await Deno.openKv(
  permissionToGetPathToDB.state === "granted" ? Deno.env.get(DENO_KV_PATH_KEY) : undefined
);

type User = {
  /**
   * Handle, i.e. @yhdgms1
   */
  handle: string;
  /**
   * User Name
   */
  name: string;
}

type UserWithId = User & {
  /**
   * GitHub ID
   */
  id: number;
}

const setUser = async (id: number | string, user: User) => {
  await kv.set(['users', Number(id)], user)
}

const getUser = async (id: number | string) => {
  const user = await kv.get(['users', Number(id)]);

  if (!user.value) {
    return 'NOT_FOUND' as const;
  }

  return {
    ...user.value,
    id
  } as UserWithId;
}

/**
 * !todo: extend pay methods to also contain name of the user
 */
const setPayMethods = async (handle: string, payMethods: PayMethod[]) => {
  await kv.set(['paying', handle], payMethods)
}

const getPayMethods = async (handle: string) => {
  const methods = await kv.get(['paying', handle]);

  if (!methods.value) {
    return 'NOT_FOUND' as const;
  }

  return methods.value as PayMethod[];
}

export { setUser, getUser, setPayMethods, getPayMethods }
export type { User }