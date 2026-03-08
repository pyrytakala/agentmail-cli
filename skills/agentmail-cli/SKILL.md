---
name: agentmail
description: "Manage agentmail via CLI - inboxes, messages, threads, drafts, domains, webhooks, lists, api-keys, pods, metrics, org. Use when user mentions 'agentmail' or wants to interact with the agentmail API."
---

# agentmail-cli

## Setup

If `agentmail-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle agentmail
npx api2cli link agentmail
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
agentmail-cli auth set "your-token"
agentmail-cli auth test
```

## Resources

### inboxes

| Command | Description |
|---------|-------------|
| `agentmail-cli inboxes list --json` | List all inboxes |
| `agentmail-cli inboxes get <inbox_id> --json` | Get an inbox by ID |
| `agentmail-cli inboxes create --username "agent" --display-name "My Agent" --json` | Create a new inbox |
| `agentmail-cli inboxes update <inbox_id> --display-name "New Name" --json` | Update inbox display name |
| `agentmail-cli inboxes delete <inbox_id> --json` | Delete an inbox |

### messages

| Command | Description |
|---------|-------------|
| `agentmail-cli messages list <inbox_id> --json` | List messages in an inbox |
| `agentmail-cli messages get <inbox_id> <message_id> --json` | Get a specific message |
| `agentmail-cli messages raw <inbox_id> <message_id> --json` | Get raw message content |
| `agentmail-cli messages send <inbox_id> --to "a@b.com" --subject "Hi" --text "Hello" --json` | Send a message |
| `agentmail-cli messages reply <inbox_id> <message_id> --text "Thanks" --json` | Reply to a message |
| `agentmail-cli messages reply-all <inbox_id> <message_id> --text "Thanks all" --json` | Reply to all |
| `agentmail-cli messages forward <inbox_id> <message_id> --to "c@d.com" --json` | Forward a message |
| `agentmail-cli messages update <inbox_id> <message_id> --add-labels "important" --json` | Update message labels |
| `agentmail-cli messages attachment <inbox_id> <message_id> <attachment_id> --json` | Get attachment |

### threads

| Command | Description |
|---------|-------------|
| `agentmail-cli threads list --json` | List all threads |
| `agentmail-cli threads list --inbox <inbox_id> --json` | List threads for an inbox |
| `agentmail-cli threads get <thread_id> --json` | Get a thread with messages |
| `agentmail-cli threads delete <inbox_id> <thread_id> --json` | Delete a thread |
| `agentmail-cli threads attachment <inbox_id> <thread_id> <attachment_id> --json` | Get thread attachment |

### drafts

| Command | Description |
|---------|-------------|
| `agentmail-cli drafts list --json` | List all drafts |
| `agentmail-cli drafts list --inbox <inbox_id> --json` | List drafts for an inbox |
| `agentmail-cli drafts get <draft_id> --json` | Get a draft |
| `agentmail-cli drafts create <inbox_id> --to "a@b.com" --subject "Hi" --text "Hello" --json` | Create a draft |
| `agentmail-cli drafts update <inbox_id> <draft_id> --subject "Updated" --json` | Update a draft |
| `agentmail-cli drafts delete <inbox_id> <draft_id> --json` | Delete a draft |
| `agentmail-cli drafts send <inbox_id> <draft_id> --json` | Send a draft |
| `agentmail-cli drafts attachment <inbox_id> <draft_id> <attachment_id> --json` | Get draft attachment |

### domains

| Command | Description |
|---------|-------------|
| `agentmail-cli domains list --json` | List all domains |
| `agentmail-cli domains get <domain_id> --json` | Get domain details |
| `agentmail-cli domains create --domain "example.com" --json` | Add a custom domain |
| `agentmail-cli domains delete <domain_id> --json` | Delete a domain |
| `agentmail-cli domains verify <domain_id> --json` | Verify domain DNS records |
| `agentmail-cli domains zone-file <domain_id> --json` | Get DNS zone file |

### webhooks

| Command | Description |
|---------|-------------|
| `agentmail-cli webhooks list --json` | List all webhooks |
| `agentmail-cli webhooks get <webhook_id> --json` | Get a webhook |
| `agentmail-cli webhooks create --url "https://..." --event-types "message.received" --json` | Create a webhook |
| `agentmail-cli webhooks update <webhook_id> --add-inbox-ids "inbox@agentmail.to" --json` | Update a webhook |
| `agentmail-cli webhooks delete <webhook_id> --json` | Delete a webhook |

### lists

| Command | Description |
|---------|-------------|
| `agentmail-cli lists list <direction> <type> --json` | List entries (direction: send/receive, type: allow/block) |
| `agentmail-cli lists get <direction> <type> <entry> --json` | Get a list entry |
| `agentmail-cli lists create <direction> <type> --entry "spam@evil.com" --json` | Add a list entry |
| `agentmail-cli lists delete <direction> <type> <entry> --json` | Remove a list entry |

### api-keys

| Command | Description |
|---------|-------------|
| `agentmail-cli api-keys list --json` | List all API keys |
| `agentmail-cli api-keys create --name "my-key" --json` | Create a new API key |
| `agentmail-cli api-keys delete <api_key> --json` | Delete an API key |

### pods

| Command | Description |
|---------|-------------|
| `agentmail-cli pods list --json` | List all pods |
| `agentmail-cli pods get <pod_id> --json` | Get a pod |
| `agentmail-cli pods create --name "my-pod" --json` | Create a pod |
| `agentmail-cli pods delete <pod_id> --json` | Delete a pod |
| `agentmail-cli pods list-inboxes <pod_id> --json` | List inboxes in a pod |
| `agentmail-cli pods list-threads <pod_id> --json` | List threads in a pod |
| `agentmail-cli pods list-drafts <pod_id> --json` | List drafts in a pod |
| `agentmail-cli pods list-domains <pod_id> --json` | List domains in a pod |

### metrics

| Command | Description |
|---------|-------------|
| `agentmail-cli metrics list --start "2026-01-01T00:00:00Z" --end "2026-01-31T00:00:00Z" --json` | List account metrics |
| `agentmail-cli metrics list --inbox <inbox_id> --start "..." --end "..." --json` | List inbox metrics |

### org

| Command | Description |
|---------|-------------|
| `agentmail-cli org get --json` | Get organization info |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
