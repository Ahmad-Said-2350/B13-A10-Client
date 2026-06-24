import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields()],
});

export const { signIn, signUp, useSession, signOut, getSession } = authClient;



