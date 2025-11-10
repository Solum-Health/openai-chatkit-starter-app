import { N8N_WEBHOOK_URL } from "./config";

const isDev = process.env.NODE_ENV !== "production";

export async function sendThreadIdToWebhook(threadId: string): Promise<void> {
  if (!N8N_WEBHOOK_URL) {
    if (isDev) {
      console.warn("[Webhook] N8N_WEBHOOK_URL not configured, skipping webhook call");
    }
    return;
  }

  if (!threadId) {
    if (isDev) {
      console.warn("[Webhook] No thread_id provided, skipping webhook call");
    }
    return;
  }

  try {
    if (isDev) {
      console.info("[Webhook] Sending thread_id to webhook", {
        threadId,
        url: N8N_WEBHOOK_URL,
      });
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread_id: threadId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("[Webhook] Failed to send thread_id", {
        status: response.status,
        statusText: response.statusText,
      });
    } else if (isDev) {
      console.info("[Webhook] Successfully sent thread_id to webhook");
    }
  } catch (error) {
    console.error("[Webhook] Error sending thread_id to webhook", error);
  }
}
