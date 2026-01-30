CREATE TABLE `api_access_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`endpoint` varchar(255) NOT NULL,
	`method` varchar(10) NOT NULL,
	`requestCount` int DEFAULT 1,
	`responseTime` int,
	`statusCode` int,
	`accessedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_access_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `language_examples` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`levelId` int NOT NULL,
	`textRu` text NOT NULL,
	`textEn` text,
	`transliteration` text,
	`context` text,
	`scenario` varchar(100),
	`tone` enum('vulgar','casual','neutral','formal','highly_formal','diplomatic'),
	`tags` text,
	`audioUrl` varchar(500),
	`notes` text,
	`isVerified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `language_examples_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `language_levels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level` int NOT NULL,
	`starRating` int NOT NULL,
	`nameRu` varchar(100) NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`characteristics` text,
	`usageContext` text,
	`colorCode` varchar(7) DEFAULT '#000000',
	`iconName` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `language_levels_id` PRIMARY KEY(`id`),
	CONSTRAINT `language_levels_level_unique` UNIQUE(`level`)
);
--> statement-breakpoint
CREATE TABLE `language_transformations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`informalText` text NOT NULL,
	`informalLevel` int NOT NULL,
	`formalText` text NOT NULL,
	`formalLevel` int NOT NULL,
	`explanationRu` text,
	`explanationEn` text,
	`category` varchar(100),
	`usageNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `language_transformations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`metricType` varchar(100) NOT NULL,
	`metricValue` int NOT NULL,
	`levelId` int,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `training_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`levelId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`titleRu` varchar(255),
	`description` text,
	`category` enum('vocabulary','phrases','idioms','grammar','conversation','formal_writing','diplomatic') NOT NULL,
	`difficulty` enum('beginner','intermediate','advanced','expert','master') DEFAULT 'intermediate',
	`estimatedDuration` int,
	`totalExamples` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`requiredAccessLevel` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `training_modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`aiEntityName` varchar(255),
	`aiEntityVersion` varchar(50),
	`moduleId` int,
	`levelId` int,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`examplesProcessed` int DEFAULT 0,
	`accuracy` int,
	`status` enum('in_progress','completed','paused','failed') DEFAULT 'in_progress',
	`metadata` text,
	CONSTRAINT `training_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','institution') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `institutionName` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `institutionType` enum('government','military','intelligence','research','corporate');--> statement-breakpoint
ALTER TABLE `users` ADD `accessLevel` int DEFAULT 1 NOT NULL;