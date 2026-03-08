import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const messagesResource = new Command("messages")
  .description("Manage inbox messages");

// ── LIST ──────────────────────────────────────────────
messagesResource
  .command("list")
  .description("List messages in an inbox")
  .argument("<inbox_id>", "Inbox ID")
  .option("--limit <n>", "Max results to return")
  .option("--page-token <token>", "Page token for pagination")
  .option("--ascending", "Sort in ascending order")
  .option("--labels <labels>", "Comma-separated labels to filter by")
  .option("--before <date>", "Filter messages before this date")
  .option("--after <date>", "Filter messages after this date")
  .option("--include-spam", "Include spam messages")
  .option("--include-blocked", "Include blocked messages")
  .option("--include-trash", "Include trashed messages")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (inboxId: string, opts) => {
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
      const data = await client.get(`/inboxes/${encodeURIComponent(inboxId)}/messages`, params);
      output(data, { json: opts.json, format: opts.format, fields: opts.fields?.split(",") });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
messagesResource
  .command("get")
  .description("Get a specific message")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<message_id>", "Message ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (inboxId: string, messageId: string, opts) => {
    try {
      const data = await client.get(`/inboxes/${encodeURIComponent(inboxId)}/messages/${messageId}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET RAW ───────────────────────────────────────────
messagesResource
  .command("raw")
  .description("Get raw message content")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<message_id>", "Message ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, messageId: string, opts) => {
    try {
      const data = await client.get(`/inboxes/${encodeURIComponent(inboxId)}/messages/${messageId}/raw`);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── SEND ──────────────────────────────────────────────
messagesResource
  .command("send")
  .description("Send a message from an inbox")
  .argument("<inbox_id>", "Inbox ID (sender)")
  .requiredOption("--to <addresses>", "Recipient address(es), comma-separated")
  .option("--cc <addresses>", "CC address(es), comma-separated")
  .option("--bcc <addresses>", "BCC address(es), comma-separated")
  .option("--reply-to <addresses>", "Reply-to address(es), comma-separated")
  .option("--subject <subject>", "Message subject")
  .option("--text <text>", "Plain text body")
  .option("--html <html>", "HTML body")
  .option("--labels <labels>", "Comma-separated labels to add")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, opts) => {
    try {
      const body: Record<string, unknown> = {};
      const toList = opts.to.split(",").map((s: string) => s.trim());
      body.to = toList.length === 1 ? toList[0] : toList;
      if (opts.cc) { const l = opts.cc.split(",").map((s: string) => s.trim()); body.cc = l.length === 1 ? l[0] : l; }
      if (opts.bcc) { const l = opts.bcc.split(",").map((s: string) => s.trim()); body.bcc = l.length === 1 ? l[0] : l; }
      if (opts.replyTo) { const l = opts.replyTo.split(",").map((s: string) => s.trim()); body.reply_to = l.length === 1 ? l[0] : l; }
      if (opts.subject) body.subject = opts.subject;
      if (opts.text) body.text = opts.text;
      if (opts.html) body.html = opts.html;
      if (opts.labels) body.labels = opts.labels.split(",").map((s: string) => s.trim());
      const data = await client.post(`/inboxes/${encodeURIComponent(inboxId)}/messages/send`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── REPLY ─────────────────────────────────────────────
messagesResource
  .command("reply")
  .description("Reply to a message")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<message_id>", "Message ID to reply to")
  .option("--to <addresses>", "Override recipient(s), comma-separated")
  .option("--cc <addresses>", "CC address(es), comma-separated")
  .option("--bcc <addresses>", "BCC address(es), comma-separated")
  .option("--text <text>", "Plain text body")
  .option("--html <html>", "HTML body")
  .option("--labels <labels>", "Comma-separated labels")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, messageId: string, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.to) { const l = opts.to.split(",").map((s: string) => s.trim()); body.to = l.length === 1 ? l[0] : l; }
      if (opts.cc) { const l = opts.cc.split(",").map((s: string) => s.trim()); body.cc = l.length === 1 ? l[0] : l; }
      if (opts.bcc) { const l = opts.bcc.split(",").map((s: string) => s.trim()); body.bcc = l.length === 1 ? l[0] : l; }
      if (opts.text) body.text = opts.text;
      if (opts.html) body.html = opts.html;
      if (opts.labels) body.labels = opts.labels.split(",").map((s: string) => s.trim());
      const data = await client.post(`/inboxes/${encodeURIComponent(inboxId)}/messages/${messageId}/reply`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── REPLY ALL ─────────────────────────────────────────
messagesResource
  .command("reply-all")
  .description("Reply to all recipients of a message")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<message_id>", "Message ID to reply to")
  .option("--text <text>", "Plain text body")
  .option("--html <html>", "HTML body")
  .option("--labels <labels>", "Comma-separated labels")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, messageId: string, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.text) body.text = opts.text;
      if (opts.html) body.html = opts.html;
      if (opts.labels) body.labels = opts.labels.split(",").map((s: string) => s.trim());
      const data = await client.post(`/inboxes/${encodeURIComponent(inboxId)}/messages/${messageId}/reply-all`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── FORWARD ───────────────────────────────────────────
messagesResource
  .command("forward")
  .description("Forward a message")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<message_id>", "Message ID to forward")
  .requiredOption("--to <addresses>", "Recipient address(es), comma-separated")
  .option("--subject <subject>", "Override subject")
  .option("--text <text>", "Additional text")
  .option("--html <html>", "Additional HTML")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, messageId: string, opts) => {
    try {
      const body: Record<string, unknown> = {};
      const toList = opts.to.split(",").map((s: string) => s.trim());
      body.to = toList.length === 1 ? toList[0] : toList;
      if (opts.subject) body.subject = opts.subject;
      if (opts.text) body.text = opts.text;
      if (opts.html) body.html = opts.html;
      const data = await client.post(`/inboxes/${encodeURIComponent(inboxId)}/messages/${messageId}/forward`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── UPDATE ────────────────────────────────────────────
messagesResource
  .command("update")
  .description("Update message labels")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<message_id>", "Message ID")
  .option("--add-labels <labels>", "Comma-separated labels to add")
  .option("--remove-labels <labels>", "Comma-separated labels to remove")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, messageId: string, opts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.addLabels) body.add_labels = opts.addLabels.split(",").map((s: string) => s.trim());
      if (opts.removeLabels) body.remove_labels = opts.removeLabels.split(",").map((s: string) => s.trim());
      const data = await client.patch(`/inboxes/${encodeURIComponent(inboxId)}/messages/${messageId}`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ATTACHMENT ────────────────────────────────────
messagesResource
  .command("attachment")
  .description("Get a message attachment")
  .argument("<inbox_id>", "Inbox ID")
  .argument("<message_id>", "Message ID")
  .argument("<attachment_id>", "Attachment ID")
  .option("--json", "Output as JSON")
  .action(async (inboxId: string, messageId: string, attachmentId: string, opts) => {
    try {
      const data = await client.get(`/inboxes/${encodeURIComponent(inboxId)}/messages/${messageId}/attachments/${attachmentId}`);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
