import PusherServer from "pusher";
import PusherClient from "pusher-js";

const appId = process.env.PUSHER_APP_ID || "1711718";
const key = process.env.PUSHER_APP_KEY || "f2ac37e0f21f18fcb84a";
const secret = process.env.PUSHER_APP_SECRET || "8262c9d71d473cdf8df2";
const cluster = process.env.PUSHER_APP_CLUSTER || "ap2";
export const pusherServer = new PusherServer({
  appId: appId,
  key: key,
  secret: secret,
  cluster: cluster,
  useTLS: true,
});

export const pusherClient = new PusherClient(key, {
  cluster: cluster,
});
