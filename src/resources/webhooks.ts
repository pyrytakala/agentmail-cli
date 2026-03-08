import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const webhooksResource = new Command("webhooks")
  .description("Manage webhooks");

// ── LIST ──────────────────────────────────────────────
webhooksResource
  .command("list")
  .description("List all webhooks")
  .option("--limit <n>", "Max results to return")
  .option("--page-token <token>", "Page token for pagination")
  .option("--ascending", "Sort in ascending order")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      if (opts.ascending) params.ascending = "true";
      const data = await client.get("/webhooks", params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
webhooksResource
  .command("get")
  .description("Get a webhook by ID")
  .argument("<webhook_id>", "Webhook ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (webhookId: string, opts) => {
    try {
      const data = await client.get(`/webhooks/${webhookId}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
webhooksResource
  .command("create")
  .description("Create a webhook")
  .requiredOption("--url <url>", "Webhook endpoint URL")
  .requiredOption("--event-types <types>", "Comma-separated event types (e.g. message.received,message.sent)")
  .option("--pod-ids <ids>", "Comma-separated pod IDs to subscribe (max 10)")
  .option("--inbox-ids <ids>", "Comma-separated inbox IDs to subscribe (max 10)")
  .option("--client-id <id>", "Client ID")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {
        url: opts.url,
        event_types: opts.eventTypes.split(",").map((s: string) => s.trim()),
      };
      if (opts.podIds) body.pod_ids = opts.podIds.split(",").map((s: string) => s.trim());
      if (opts.inboxIds) body.inbox_ids = opts.inboxIds.split(",").map((s: string) => s.trim());
      if (opts.clientId) body.client_id = opts.clientId;
      const data = await client.post("/webhooks", body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── UPDATE ────────────────────────────────────────────
webhooksResource
  .command("update")
  .description("Update a webhook")
  .argument("<webhook_id>", "Webhook ID")
  .option("--add-inbox-ids <ids>", "Comma-separated inbox IDs to subscribe")
  .option("--remove-inbox-ids <ids>", "Comma-separated inbox IDs to unsubscribe")
  .option("--add-pod-ids <ids>", "Comma-separated pod IDs to subscribe")
  .option("--remove-pod-ids <ids>", "Comma-separated pod IDs to unsubscribe")
  .option("--json", "Output as JSON")
  .action(async (webhookId: string, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.addInboxIds) body.add_inbox_ids = opts.addInboxIds.split(",").map((s: string) => s.trim());
      if (opts.removeInboxIds) body.remove_inbox_ids = opts.removeInboxIds.split(",").map((s: string) => s.trim());
      if (opts.addPodIds) body.add_pod_ids = opts.addPodIds.split(",").map((s: string) => s.trim());
      if (opts.removePodIds) body.remove_pod_ids = opts.removePodIds.split(",").map((s: string) => s.trim());
      const data = await client.patch(`/webhooks/${webhookId}`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
webhooksResource
  .command("delete")
  .description("Delete a webhook")
  .argument("<webhook_id>", "Webhook ID")
  .option("--json", "Output as JSON")
  .action(async (webhookId: string, opts) => {
    try {
      await client.delete(`/webhooks/${webhookId}`);
      output({ deleted: true, webhook_id: webhookId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
