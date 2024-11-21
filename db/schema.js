import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  pgEnum,
  timestamp,
  check,
  numeric,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const rolesEnum = pgEnum('role', ['reserver', 'admin'])

export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar().notNull(),
    password: varchar().notNull(),
    email: varchar().notNull().unique(),
    isAdmin: boolean().notNull().default(false),
    age: integer().notNull(),
    role: rolesEnum().notNull().default('reserver'),
  },
  (table) => ({
    checkConstrait: check('users_age_check', sql`${table.age} > 12`),
  })
)

export const usersRelations = relations(users, ({ many }) => ({
  reservations: many(reservations),
  resources: many(resources),
}))

export const resources = pgTable('resources', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  description: text(),
  hourlyRate: numeric({ precision: 4, scale: 2 }).notNull(),
  userId: integer()
    .notNull()
    .references(() => users.id),
})

export const resourcesRelations = relations(resources, ({ many }) => ({
  reservations: many(reservations),
}))

export const reservations = pgTable(
  'reservations',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
      .notNull()
      .references(() => users.id),
    resourceId: integer()
      .notNull()
      .references(() => resources.id),
    startTime: timestamp({ withTimezone: true }).notNull(),
    endTime: timestamp({ withTimezone: true }).notNull(),
  },
  (table) => ({
    checkConstrait: check(
      'reservations_timestamp_check',
      sql`${table.endTime} > ${table.startTime}`
    ),
  })
)

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, { fields: [reservations.userId], references: [users.id] }),
  resources: one(resources, {
    fields: [reservations.resourceId],
    references: [resources.id],
  }),
}))
