import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    method: "POST",
    path: "/clerk-webhook",
    handler: httpAction(async (ctx, req) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("CLERK_WEBHOOK_SECRET is not set");
        }
        const svix_id = req.headers.get("svix-id");
        const svix_timestamp = req.headers.get("svix-timestamp");
        const svix_signature = req.headers.get("svix-signature");
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response("Missing svix headers", { status: 400 });
        }
        const payload = await req.json();
        const body = JSON.stringify(payload);
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;
        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            console.error(err);
            return new Response("Invalid svix payload", { status: 400 });
        }
        if (evt.type === "user.created") {
            const { id, email_addresses, image_url, first_name, last_name } = evt.data;

            const email = email_addresses[0].email_address;
            const name = `${first_name} ${last_name}`.trim();
            
            try {
                await ctx.runMutation(api.users.syncUser, {
                    clerkId: id,
                    email,
                    name,
                    image: image_url,
                })
            } catch (err) {
                console.error(err);
                return new Response("Failed to create user", { status: 500 });
            }
        }
        return new Response("Webhook processed successfully", { status: 200 });
    }),
});

export default http;