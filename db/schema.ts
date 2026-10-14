import {sqliteTable,text,integer,primaryKey} from 'drizzle-orm/sqlite-core';
export const uploadLedger=sqliteTable('upload_ledger',{id:text('id').primaryKey(),owner:text('owner').notNull(),bytes:integer('bytes').notNull()});
export const limits=sqliteTable('request_limits',{key:text('key').notNull(),window:integer('window').notNull(),hits:integer('hits').notNull().default(0)},t=>[primaryKey({columns:[t.key,t.window]})]);
export const annotations=sqliteTable('annotations',{id:text('id').primaryKey(),owner:text('owner').notNull(),version:integer('version').notNull().default(0),data:text('data').notNull(),updated:text('updated').notNull()});
