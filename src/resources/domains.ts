import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const domainsResource = new Command("domains")
  .description("Manage custom domains");

// ── LIST ──────────────────────────────────────────────
domainsResource
  .command("list")
  .description("List all domains")
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
      const data = await client.get("/domains", params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
domainsResource
  .command("get")
  .description("Get domain details")
  .argument("<domain_id>", "Domain ID (e.g. example.com)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (domainId: string, opts) => {
    try {
      const data = await client.get(`/domains/${encodeURIComponent(domainId)}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
domainsResource
  .command("create")
  .description("Add a custom domain")
  .requiredOption("--domain <domain>", "Domain name (e.g. example.com)")
  .option("--feedback-enabled", "Enable bounce/complaint notifications")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const data = await client.post("/domains", {
        domain: opts.domain,
        feedback_enabled: opts.feedbackEnabled ?? false,
      });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
domainsResource
  .command("delete")
  .description("Delete a domain")
  .argument("<domain_id>", "Domain ID")
  .option("--json", "Output as JSON")
  .action(async (domainId: string, opts) => {
    try {
      await client.delete(`/domains/${encodeURIComponent(domainId)}`);
      output({ deleted: true, domain_id: domainId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── VERIFY ────────────────────────────────────────────
domainsResource
  .command("verify")
  .description("Verify a domain's DNS records")
  .argument("<domain_id>", "Domain ID")
  .option("--json", "Output as JSON")
  .action(async (domainId: string, opts) => {
    try {
      const data = await client.post(`/domains/${encodeURIComponent(domainId)}/verify`);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── ZONE FILE ─────────────────────────────────────────
domainsResource
  .command("zone-file")
  .description("Get DNS zone file for a domain")
  .argument("<domain_id>", "Domain ID")
  .option("--json", "Output as JSON")
  .action(async (domainId: string, opts) => {
    try {
      const data = await client.get(`/domains/${encodeURIComponent(domainId)}/zone-file`);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
