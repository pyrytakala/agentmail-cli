#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
import { inboxesResource } from "./resources/inboxes.js";
import { messagesResource } from "./resources/messages.js";
import { threadsResource } from "./resources/threads.js";
import { draftsResource } from "./resources/drafts.js";
import { domainsResource } from "./resources/domains.js";
import { webhooksResource } from "./resources/webhooks.js";
import { listsResource } from "./resources/lists.js";
import { apiKeysResource } from "./resources/api-keys.js";
import { podsResource } from "./resources/pods.js";
import { metricsResource } from "./resources/metrics.js";
import { organizationsResource } from "./resources/organizations.js";

const program = new Command();

program
  .name("agentmail-cli")
  .description("CLI for the AgentMail API — email inboxes for AI agents")
  .version("0.1.0")
  .option("--json", "Output as JSON", false)
  .option("--format <fmt>", "Output format: text, json, csv, yaml", "text")
  .option("--verbose", "Enable debug logging", false)
  .option("--no-color", "Disable colored output")
  .option("--no-header", "Omit table/csv headers (for piping)")
  .hook("preAction", (_thisCmd, actionCmd) => {
    const root = actionCmd.optsWithGlobals();
    globalFlags.json = root.json ?? false;
    globalFlags.format = root.format ?? "text";
    globalFlags.verbose = root.verbose ?? false;
    globalFlags.noColor = root.color === false;
    globalFlags.noHeader = root.header === false;
  });

// Built-in commands
program.addCommand(authCommand);

// Resources
program.addCommand(inboxesResource);
program.addCommand(messagesResource);
program.addCommand(threadsResource);
program.addCommand(draftsResource);
program.addCommand(domainsResource);
program.addCommand(webhooksResource);
program.addCommand(listsResource);
program.addCommand(apiKeysResource);
program.addCommand(podsResource);
program.addCommand(metricsResource);
program.addCommand(organizationsResource);

program.parse();
