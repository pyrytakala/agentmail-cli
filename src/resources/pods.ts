import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const podsResource = new Command("pods")
  .description("Manage pods (isolated environments)");

// ── LIST ──────────────────────────────────────────────
podsResource
  .command("list")
  .description("List all pods")
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
      const data = await client.get("/pods", params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
podsResource
  .command("get")
  .description("Get a pod by ID")
  .argument("<pod_id>", "Pod ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (podId: string, opts) => {
    try {
      const data = await client.get(`/pods/${podId}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
podsResource
  .command("create")
  .description("Create a new pod")
  .option("--name <name>", "Pod name")
  .option("--client-id <id>", "Client ID")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.clientId) body.client_id = opts.clientId;
      const data = await client.post("/pods", body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
podsResource
  .command("delete")
  .description("Delete a pod")
  .argument("<pod_id>", "Pod ID")
  .option("--json", "Output as JSON")
  .action(async (podId: string, opts) => {
    try {
      await client.delete(`/pods/${podId}`);
      output({ deleted: true, pod_id: podId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── POD INBOXES ───────────────────────────────────────
podsResource
  .command("list-inboxes")
  .description("List inboxes in a pod")
  .argument("<pod_id>", "Pod ID")
  .option("--limit <n>", "Max results")
  .option("--page-token <token>", "Page token")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (podId: string, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      const data = await client.get(`/pods/${podId}/inboxes`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── POD THREADS ───────────────────────────────────────
podsResource
  .command("list-threads")
  .description("List threads in a pod")
  .argument("<pod_id>", "Pod ID")
  .option("--limit <n>", "Max results")
  .option("--page-token <token>", "Page token")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (podId: string, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      const data = await client.get(`/pods/${podId}/threads`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── POD DRAFTS ────────────────────────────────────────
podsResource
  .command("list-drafts")
  .description("List drafts in a pod")
  .argument("<pod_id>", "Pod ID")
  .option("--limit <n>", "Max results")
  .option("--page-token <token>", "Page token")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (podId: string, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      const data = await client.get(`/pods/${podId}/drafts`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── POD DOMAINS ───────────────────────────────────────
podsResource
  .command("list-domains")
  .description("List domains in a pod")
  .argument("<pod_id>", "Pod ID")
  .option("--limit <n>", "Max results")
  .option("--page-token <token>", "Page token")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (podId: string, opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      const data = await client.get(`/pods/${podId}/domains`, params);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
