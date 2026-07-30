CREATE TABLE `character_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` integer NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`title` text,
	`body` text,
	`image_key` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `characters` ADD `thumbnail_image_key` text;--> statement-breakpoint
ALTER TABLE `characters` ADD `hero_image_key` text;