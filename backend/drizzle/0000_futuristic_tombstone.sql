CREATE TABLE IF NOT EXISTS "newsletter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(50) NOT NULL,
	"description" varchar(255),
	"image_key" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletter_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(50) NOT NULL,
	"content" varchar(255) NOT NULL,
	"newsletter_id" uuid NOT NULL,
	"attachmentKey" varchar(255),
	"sent" boolean DEFAULT false NOT NULL,
	"schedule" date,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	"deleted_at" date,
	"scheduled_at" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50),
	"email" varchar(255) NOT NULL,
	"subscribed" boolean DEFAULT false NOT NULL,
	"subscriptionChangedAt" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipientId" uuid,
	"newsletterId" uuid,
	"createdAt" date DEFAULT now() NOT NULL,
	"updatedAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newsletter_entry" ADD CONSTRAINT "newsletter_entry_newsletter_id_newsletter_id_fk" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletter"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_recipientId_recipients_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."recipients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_newsletterId_newsletter_id_fk" FOREIGN KEY ("newsletterId") REFERENCES "public"."newsletter"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

INSERT INTO "users" (name, email, password, role) VALUES ('Luis', 'luismtzesq@gmail.com', '$2a$10$OI/AcKoIGPaV1yRASqBGtOe7Uouv1gBgQueO64L9rXcvKnDByG8bC', 'admin');
INSERT INTO "users" (name, email, password, role) VALUES ('user', 'esquizo@gmail.com', '$2a$10$NDcgMjqf8fcZwasqdPjyK.Zinuz.W076yFA8ucxaQt3AixfLpsToq', 'user');