import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  signup: handleLogin({ auhorizationParams: { screen_hint: "signup" } }),
});
