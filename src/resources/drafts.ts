import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const draftsResource = new Command("drafts")
  .description("Manage email drafts");

// ── LIST ──────────────────────────────────────────────
draftsResource
  .command("list")
  .description("List drafts (optionally scoped to an inbox)")
  .option("--inbox <inbox_id>", "Scope to a specific inbox")
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
      const path = opts.inbox
        ? `/inboxes/${encodeURIComponent(opts.inbox)}/drafts`
        : "/drafts";
      const data = await client.get(path, params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
draftsResource
  .command("get")
  .description("Get a draft by ID")
  .argument("<draft_id>", "Draft ID")
  .option("--inbox <inbox_id>", "Scope to a specific inbox")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (draftId: string, opts) => {
    try {
      const path = opts.inbox
        ? `/inboxes/${encodeURIComponent(opts.inbox)}/drafts/${draftId}`
        : `/drafts/${draftId}`;
      const data = await client.get(path);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
draftsResource
  .command("create")
  .description("Create a new draft")
  .argument("<inbox_id>", "Inbox ID")
  .option("--to <addresses>", "Recipient address(es), comma-separated")
  .option("--cc <addresses>", "CC address(es), comma-separated")
  .option("--bcc <addresses>", "BCC address(es), comma-separated")
  .option("--reply-to <addresses>", "Reply-to address(es), comma-separated")
  .option("--subject <subject>", "Subject")
  .option("--text <text>", "Plain text body")
  .option("--html <html>", "HTML body")
  .option("--labels <labels>", "Comma-separated labels")
  .option("--in-reply-to <id>", "Message ID this is in reply to")
  .option("--send-at <date>", "Schedule send time (ISO 8601)")
  .option("--client-id <id>", "Client ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.to) body.to = opts.to.split(",").map((s: string) => s.trim());
      if (opts.cc) body.cc = opts.cc.split(",").map((s: string) => s.trim());
      if (opts.bcc) body.bcc = opts.bcc.split(",").map((s: string) => s.trim());
      if (opts.replyTo) body.reply_to = opts.replyTo.split(",").map((s: string) => s.trim());
      if (opts.subject) body.subject = opts.subject;
      if (opts.text) body.text = opts.text;
      if (opts.html) body.html = opts.html;
      if (opts.labels) body.labels = opts.labels.split(",").map((s: string) => s.trim());
      if (opts.inReplyTo) body.in_reply_to = opts.inReplyTo;
      if (opts.sendAt) body.send_at = opts.sendAt;
      if (opts.clientId) body.client_id = opts.clientId;
      const data = await client.post(`/inboxes/${encodeURIComponent(inboxId)}/drafts`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── UPDATE ────────────────────────────────────────────
draftsResource
  .command("update")
  .description("Update a draft")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<draft_id>", "Draft ID")
  .option("--to <addresses>", "Recipient address(es), comma-separated")
  .option("--cc <addresses>", "CC address(es), comma-separated")
  .option("--bcc <addresses>", "BCC address(es), comma-separated")
  .option("--reply-to <addresses>", "Reply-to address(es), comma-separated")
  .option("--subject <subject>", "Subject")
  .option("--text <text>", "Plain text body")
  .option("--html <html>", "HTML body")
  .option("--send-at <date>", "Schedule send time (ISO 8601)")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, draftId: string, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.to) body.to = opts.to.split(",").map((s: string) => s.trim());
      if (opts.cc) body.cc = opts.cc.split(",").map((s: string) => s.trim());
      if (opts.bcc) body.bcc = opts.bcc.split(",").map((s: string) => s.trim());
      if (opts.replyTo) body.reply_to = opts.replyTo.split(",").map((s: string) => s.trim());
      if (opts.subject) body.subject = opts.subject;
      if (opts.text) body.text = opts.text;
      if (opts.html) body.html = opts.html;
      if (opts.sendAt) body.send_at = opts.sendAt;
      const data = await client.patch(`/inboxes/${encodeURIComponent(inboxId)}/drafts/${draftId}`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
draftsResource
  .command("delete")
  .description("Delete a draft")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<draft_id>", "Draft ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, draftId: string, opts) => {
    try {
      await client.delete(`/inboxes/${encodeURIComponent(inboxId)}/drafts/${draftId}`);
      output({ deleted: true, draft_id: draftId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── SEND ──────────────────────────────────────────────
draftsResource
  .command("send")
  .description("Send a draft")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<draft_id>", "Draft ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, draftId: string, opts) => {
    try {
      const data = await client.post(`/inboxes/${encodeURIComponent(inboxId)}/drafts/${draftId}/send`);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ATTACHMENT ────────────────────────────────────
draftsResource
  .command("attachment")
  .description("Get a draft attachment")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<draft_id>", "Draft ID")
  .argument("<attachment_id>", "Attachment ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, draftId: string, attachmentId: string, opts) => {
    try {
      const data = await client.get(`/inboxes/${encodeURIComponent(inboxId)}/drafts/${draftId}/attachments/${attachmentId}`);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
