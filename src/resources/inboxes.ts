import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const inboxesResource = new Command("inboxes")
  .description("Manage email inboxes");

// ── LIST ──────────────────────────────────────────────
inboxesResource
  .command("list")
  .description("List all inboxes")
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
      const data = await client.get("/inboxes", params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
inboxesResource
  .command("get")
  .description("Get an inbox by ID")
  .argument("<inbox_id>", "Inbox ID (email address)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (inboxId: string, opts) => {
    try {
      const data = await client.get(`/inboxes/${encodeURIComponent(inboxId)}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
inboxesResource
  .command("create")
  .description("Create a new inbox")
  .option("--username <username>", "Username for the address (random if not specified)")
  .option("--domain <domain>", "Domain for the address (defaults to agentmail.to)")
  .option("--display-name <name>", "Display name")
  .option("--client-id <id>", "Client ID")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.username) body.username = opts.username;
      if (opts.domain) body.domain = opts.domain;
      if (opts.displayName) body.display_name = opts.displayName;
      if (opts.clientId) body.client_id = opts.clientId;
      const data = await client.post("/inboxes", body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── UPDATE ────────────────────────────────────────────
inboxesResource
  .command("update")
  .description("Update an inbox")
  .argument("<inbox_id>", "Inbox ID")
  .requiredOption("--display-name <name>", "New display name")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, opts) => {
    try {
      const data = await client.patch(`/inboxes/${encodeURIComponent(inboxId)}`, {
        display_name: opts.displayName,
      });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
inboxesResource
  .command("delete")
  .description("Delete an inbox")
  .argument("<inbox_id>", "Inbox ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, opts) => {
    try {
      await client.delete(`/inboxes/${encodeURIComponent(inboxId)}`);
      output({ deleted: true, inbox_id: inboxId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
