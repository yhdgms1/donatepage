import type { Session } from '@auth/core/types'
import type { AuthConfig } from '@auth/core'
import { getUser, setUser } from './kv.ts'
import { setEnvDefaults, createActionURL, Auth } from '@auth/core'
import GitHub from '@auth/core/providers/github'
import { setPayMethods } from "./kv.ts";

const getEnv = () => {
  return {
    AUTH_SECRET: Deno.env.get('AUTH_SECRET'),
    AUTH_GITHUB_CLIENT_ID: Deno.env.get('AUTH_GITHUB_CLIENT_ID'),
    AUTH_GITHUB_CLIENT_SECRET: Deno.env.get('AUTH_GITHUB_CLIENT_SECRET')
  }
}

const authConfig: AuthConfig = {
  trustHost: true,
  secret: Deno.env.get('AUTH_SECRET'),
  providers: [
    GitHub({
      clientId: Deno.env.get('AUTH_GITHUB_CLIENT_ID'),
      clientSecret: Deno.env.get('AUTH_GITHUB_CLIENT_SECRET'),
    })
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      if (trigger === 'signIn' && profile && profile.id && profile.login) {
        const user = await getUser(profile.id);

        if (user === 'NOT_FOUND') {
          await Promise.all([
            setUser(profile.id, {
              handle: profile.login as string,
              name: profile.name || ''
            }),

            setPayMethods(profile.login as string, [])
          ]);
        }
      }

      if (account && profile && profile.id) {
        token.id = profile.id;
      }

      return token;
    },
    session({ session, token }) {
      session.userId = String(token.id)

      return session
    }
  }
}

const getSession = async (req: Request) => {
  setEnvDefaults(getEnv(), authConfig);

  // todo: https
  const url = createActionURL('session', 'https', req.headers, getEnv(), authConfig.basePath);

  const response = await Auth(
    new Request(url, { headers: { cookie: req.headers.get('cookie') ?? '' } }),
    authConfig
  );

  const { status = 200 } = response;
  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status !== 200) return null;

  return data as Session;
}

export { getSession, authConfig, Auth }