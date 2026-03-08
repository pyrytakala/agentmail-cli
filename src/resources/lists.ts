import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const listsResource = new Command("lists")
  .description("Manage allow/block lists for sending and receiving");

// ── LIST ENTRIES ──────────────────────────────────────
listsResource
  .command("list")
  .description("List entries in an allow/block list")
  .argument("<direction>", "Direction: send or receive")
  .argument("<type>", "List type: allow or block")
  .option("--limit <n>", "Max results to return")
  .option("--page-token <token>", "Page token for pagination")
  .option("--ascending", "Sort in ascending order")
  .option("--entry <entry>", "Filter by entry")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (direction: string, type: string, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      if (opts.ascending) params.ascending = "true";
      if (opts.entry) params.entry = opts.entry;
      const data = await client.get(`/lists/${direction}/${type}`, params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ENTRY ─────────────────────────────────────────
listsResource
  .command("get")
  .description("Get a specific list entry")
  .argument("<direction>", "Direction: send or receive")
  .argument("<type>", "List type: allow or block")
  .argument("<entry>", "Entry (email or domain)")
  .option("--json", "Output as JSON")
  .action(async (direction: string, type: string, entry: string, opts) => {
    try {
      const data = await client.get(`/lists/${direction}/${type}/${encodeURIComponent(entry)}`);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ENTRY ──────────────────────────────────────
listsResource
  .command("create")
  .description("Add an entry to an allow/block list")
  .argument("<direction>", "Direction: send or receive")
  .argument("<type>", "List type: allow or block")
  .requiredOption("--entry <entry>", "Email address or domain to add")
  .option("--reason <reason>", "Reason for adding")
  .option("--json", "Output as JSON")
  .action(async (direction: string, type: string, opts) => {
    try {
      const body: Record<string, unknown> = { entry: opts.entry };
      if (opts.reason) body.reason = opts.reason;
      const data = await client.post(`/lists/${direction}/${type}`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ENTRY ──────────────────────────────────────
listsResource
  .command("delete")
  .description("Remove an entry from an allow/block list")
  .argument("<direction>", "Direction: send or receive")
  .argument("<type>", "List type: allow or block")
  .argument("<entry>", "Entry to remove")
  .option("--json", "Output as JSON")
  .action(async (direction: string, type: string, entry: string, opts) => {
    try {
      await client.delete(`/lists/${direction}/${type}/${encodeURIComponent(entry)}`);
      output({ deleted: true, entry }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
