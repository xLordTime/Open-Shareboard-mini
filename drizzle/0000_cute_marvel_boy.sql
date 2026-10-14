CREATE TABLE `annotations` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`data` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `request_limits` (
	`key` text NOT NULL,
	`window` integer NOT NULL,
	`hits` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`key`, `window`)
);
--> statement-breakpoint
CREATE TABLE `upload_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`bytes` integer NOT NULL
);
