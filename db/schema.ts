import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image').notNull(),
  nickname: text('nickname').notNull().unique(),
  handle: text('handle').notNull().unique(),
  description: text('description').default('').notNull(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  authorId: text('authorId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

export const postImages = pgTable('postImages', {
  id: uuid('id').primaryKey().defaultRandom(),
  src: varchar('src', { length: 255 }).notNull(),
  postId: integer('postId')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
});

export const followers = pgTable(
  'followers',
  {
    fromId: text('fromId')
      .notNull()
      .references(() => users.id),
    toId: text('toId')
      .notNull()
      .references(() => users.id),
  },
  (followers) => ({
    pk: primaryKey({ columns: [followers.fromId, followers.toId] }),
  })
);

export const usersRelation = relations(users, ({ many }) => ({
  followers: many(followers, { relationName: 'user_followers' }),
  follows: many(followers, { relationName: 'user_follows' }),
  posts: many(posts, { relationName: 'user_posts' }),
}));

export const postsRelation = relations(posts, ({ one, many }) => ({
  posts: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: 'user_posts',
  }),
  images: many(postImages, { relationName: 'post_images' }),
}));

export const postImagesRelation = relations(postImages, ({ one }) => ({
  posts: one(posts, {
    fields: [postImages.postId],
    references: [posts.id],
    relationName: 'post_images',
  }),
}));

export const followersRelation = relations(followers, ({ one }) => ({
  followers: one(users, {
    fields: [followers.toId],
    references: [users.id],
    relationName: 'user_followers',
  }),
  follows: one(users, {
    fields: [followers.fromId],
    references: [users.id],
    relationName: 'user_follows',
  }),
}));
