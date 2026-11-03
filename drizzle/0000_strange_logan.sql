CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`action` text NOT NULL,
	`record_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_owner_created` ON `audit` (`owner`,`created_at`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`detail` text NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `records_owner_created` ON `records` (`owner`,`created_at`);