import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const metricsResource = new Command("metrics")
  .description("View email metrics");

// ── LIST (global) ─────────────────────────────────────
metricsResource
  .command("list")
  .description("List metrics (optionally scoped to an inbox)")
  .option("--inbox <inbox_id>", "Scope to a specific inbox")
  .requiredOption("--start <date>", "Start timestamp (ISO 8601)")
  .requiredOption("--end <date>", "End timestamp (ISO 8601)")
  .option("--event-types <types>", "Comma-separated event types (e.g. message.sent,message.delivered)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = {
        start_timestamp: opts.start,
        end_timestamp: opts.end,
      };
      if (opts.eventTypes) params.event_types = opts.eventTypes;
      const path = opts.inbox
        ? `/inboxes/${encodeURIComponent(opts.inbox)}/metrics`
        : "/metrics";
      const data = await client.get(path, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
