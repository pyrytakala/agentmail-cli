import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const threadsResource = new Command("threads")
  .description("Manage email threads");

// ── LIST (global) ─────────────────────────────────────
threadsResource
  .command("list")
  .description("List threads (optionally scoped to an inbox)")
  .option("--inbox <inbox_id>", "Scope to a specific inbox")
  .option("--limit <n>", "Max results to return")
  .option("--page-token <token>", "Page token for pagination")
  .option("--ascending", "Sort in ascending order")
  .option("--labels <labels>", "Comma-separated labels to filter by")
  .option("--before <date>", "Filter threads before this date")
  .option("--after <date>", "Filter threads after this date")
  .option("--include-spam", "Include spam")
  .option("--include-blocked", "Include blocked")
  .option("--include-trash", "Include trashed")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (opts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      if (opts.ascending) params.ascending = "true";
      if (opts.labels) params.labels = opts.labels;
      if (opts.before) params.before = opts.before;
      if (opts.after) params.after = opts.after;
      if (opts.includeSpam) params.include_spam = "true";
      if (opts.includeBlocked) params.include_blocked = "true";
      if (opts.includeTrash) params.include_trash = "true";
      const path = opts.inbox
        ? `/inboxes/${encodeURIComponent(opts.inbox)}/threads`
        : "/threads";
      const data = await client.get(path, params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
threadsResource
  .command("get")
  .description("Get a thread with all messages")
  .argument("<thread_id>", "Thread ID")
  .option("--inbox <inbox_id>", "Scope to a specific inbox")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (threadId: string, opts) => {
    try {
      const path = opts.inbox
        ? `/inboxes/${encodeURIComponent(opts.inbox)}/threads/${threadId}`
        : `/threads/${threadId}`;
      const data = await client.get(path);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
threadsResource
  .command("delete")
  .description("Delete a thread")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<thread_id>", "Thread ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, threadId: string, opts) => {
    try {
      await client.delete(`/inboxes/${encodeURIComponent(inboxId)}/threads/${threadId}`);
      output({ deleted: true, thread_id: threadId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ATTACHMENT ────────────────────────────────────
threadsResource
  .command("attachment")
  .description("Get a thread attachment")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<thread_id>", "Thread ID")
  .argument("<attachment_id>", "Attachment ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, threadId: string, attachmentId: string, opts) => {
    try {
      const data = await client.get(`/inboxes/${encodeURIComponent(inboxId)}/threads/${threadId}/attachments/${attachmentId}`);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
