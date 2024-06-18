ALTER TABLE "user" DROP CONSTRAINT "user_nickname_unique";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "nickname" SET DEFAULT 'user-9Or7B0SJtiKl';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "handle" SET DEFAULT '@user-zKHDhwzIp9';--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_handle_unique" UNIQUE("handle");