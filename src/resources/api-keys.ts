import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const apiKeysResource = new Command("api-keys")
  .description("Manage API keys");

// ── LIST ──────────────────────────────────────────────
apiKeysResource
  .command("list")
  .description("List all API keys")
  .option("--limit <n>", "Max results to return")
  .option("--page-token <token>", "Page token for pagination")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      const data = await client.get("/api-keys", params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
apiKeysResource
  .command("create")
  .description("Create a new API key")
  .requiredOption("--name <name>", "Name for the API key")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/api-keys", { name: opts.name });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
apiKeysResource
  .command("delete")
  .description("Delete an API key")
  .argument("<api_key>", "API key to delete")
  .option("--json", "Output as JSON")
  .action(async (apiKey: string, opts) => {
    try {
      await client.delete(`/api-keys/${apiKey}`);
      output({ deleted: true, api_key: apiKey }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
