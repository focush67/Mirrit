import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/utilities/database";

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.log("Missing Clerk Secret, got ", WEBHOOK_SECRET);
    throw new Error("Clerk Webhook Secret not found");
  }
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    console.log("Svix headers problematic", {
      svix_id,
      svix_timestamp,
      svix_signature,
    });
    return new Response(
      "Error occured, no svix headers were found at webhook POST",
      {
        status: 404,
      }
    );
  }
  const payload = await request.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature || "",
    }) as WebhookEvent;
  } catch (error: any) {
    console.log("Error verifying webhook ", error.message);
    return new Response("ERROR OCCURED", {
      status: 400,
    });
  }

  const eventType = event.type;
  const { id, username, image_url } = payload.data;

  if (eventType === "user.created") {
    const newUser = await db.user.create({
      data: {
        username: username,
        imageUrl: image_url,
        externalUserId: id,
      },
    });
    console.log("User created ", newUser);
    return new Response("New user created", {
      status: 201,
    });
  }

  if (eventType === "user.updated") {
    const currentUser = await db.user.findUnique({
      where: {
        externalUserId: id,
      },
    });
    if (!currentUser) {
      console.log("User not found to update");
      return new Response("User not found", {
        status: 404,
      });
    }
    await db.user.update({
      where: {
        externalUserId: id,
      },
      data: {
        username: username,
        imageUrl: image_url,
      },
    });

    console.log("User updated ");
    return new Response("User updated", {
      status: 201,
    });
  }

  if (eventType === "user.deleted") {
    await db.user.delete({
      where: {
        externalUserId: id,
      },
    });

    console.log("User deleted");
    return new Response("User deleted", {
      status: 201,
    });
  }

  return new Response("No event triggered", {
    status: 500,
  });
}
