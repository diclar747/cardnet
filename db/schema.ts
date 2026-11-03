import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('records', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), kind: text('kind').notNull(),
  name: text('name').notNull(), detail: text('detail').notNull(), category: text('category').notNull(),
  status: text('status').notNull(), createdAt: text('created_at').notNull(),
}, table => [index('records_owner_created').on(table.owner, table.createdAt)]);
export const audit = sqliteTable('audit', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), action: text('action').notNull(),
  recordId: text('record_id').notNull(), createdAt: text('created_at').notNull(),
}, table => [index('audit_owner_created').on(table.owner, table.createdAt)]);
