import PusherServer from "pusher";
import PusherClient from "pusher-js";
import dotenv from "dotenv";

dotenv.config();

const appId = process.env.NEXT_PUBLIC_PUSHER_APP_ID || "PUSHER APP ID";
const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "PUSHER APP KEY";
const secret = process.env.PUSHER_APP_SECRET || "PUSHER APP SECRET";

export const pusherServer = new PusherServer({
  appId: appId,
  key: key,
  secret: secret,
  cluster: "ap2",
  useTLS: true,
});

export const pusherClient = new PusherClient(key, {
  cluster: "ap2",
});
