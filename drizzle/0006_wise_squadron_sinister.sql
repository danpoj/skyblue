CREATE TABLE IF NOT EXISTS "postImages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"src" varchar(255) NOT NULL,
	"postId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "content" TO "text";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "nickname" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "handle" DROP DEFAULT;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postImages" ADD CONSTRAINT "postImages_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_nickname_unique" UNIQUE("nickname");