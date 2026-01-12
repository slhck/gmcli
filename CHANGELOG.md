# Changelog

## 0.2.0

- Added global `--json` flag for machine-readable output
  - `accounts list --json` returns JSON array of email addresses
  - `search --json` returns full `ThreadSearchResult` including `hasAttachments` per message
  - `thread --json` returns raw Gmail API payload (includes HTML body parts for processing)
  - `thread --download --json` returns downloaded attachment info as JSON

## 0.1.0

Initial release.

- Account management (add, remove, list)
  - `--manual` flag for browserless OAuth (paste redirect URL)
- Search threads with Gmail query syntax
  - Returns thread ID, date, sender, subject, labels (human-readable names)
- View threads with message IDs and attachment info
- Download attachments
- Labels management
  - List all labels with `labels list`
  - Modify labels by name or ID (case-insensitive)
- Drafts (create, list, get, delete, send)
  - Support for replies (`--reply-to <messageId>`)
  - Support for attachments (`--attach <file>`)
- Send emails directly
  - Same options as draft creation
- Generate Gmail web URLs for threads (`url` command)
  - Uses canonical URL format with `authuser` parameter
