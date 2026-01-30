import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "institution"]).default("user").notNull(),
  institutionName: varchar("institutionName", { length: 255 }),
  institutionType: mysqlEnum("institutionType", ["government", "military", "intelligence", "research", "corporate"]),
  accessLevel: int("accessLevel").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Russian Language Proficiency Levels (5-Star System)
 */
export const languageLevels = mysqlTable("language_levels", {
  id: int("id").autoincrement().primaryKey(),
  level: int("level").notNull().unique(), // 1-5
  starRating: int("starRating").notNull(), // 1-5 stars
  nameRu: varchar("nameRu", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }).notNull(),
  description: text("description").notNull(),
  characteristics: text("characteristics"), // JSON array of characteristics
  usageContext: text("usageContext"), // Where this level is used
  colorCode: varchar("colorCode", { length: 7 }).default("#000000"),
  iconName: varchar("iconName", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LanguageLevel = typeof languageLevels.$inferSelect;
export type InsertLanguageLevel = typeof languageLevels.$inferInsert;

/**
 * Training Modules - Collections of language examples by level
 */
export const trainingModules = mysqlTable("training_modules", {
  id: int("id").autoincrement().primaryKey(),
  levelId: int("levelId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  titleRu: varchar("titleRu", { length: 255 }),
  description: text("description"),
  category: mysqlEnum("category", ["vocabulary", "phrases", "idioms", "grammar", "conversation", "formal_writing", "diplomatic"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced", "expert", "master"]).default("intermediate"),
  estimatedDuration: int("estimatedDuration"), // in minutes
  totalExamples: int("totalExamples").default(0),
  isActive: boolean("isActive").default(true),
  requiredAccessLevel: int("requiredAccessLevel").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrainingModule = typeof trainingModules.$inferSelect;
export type InsertTrainingModule = typeof trainingModules.$inferInsert;

/**
 * Language Examples - Individual training data entries
 */
export const languageExamples = mysqlTable("language_examples", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  levelId: int("levelId").notNull(),
  textRu: text("textRu").notNull(), // Russian text
  textEn: text("textEn"), // English translation
  transliteration: text("transliteration"), // Latin transliteration
  context: text("context"), // Usage context description
  scenario: varchar("scenario", { length: 100 }), // e.g., "street", "business", "diplomatic"
  tone: mysqlEnum("tone", ["vulgar", "casual", "neutral", "formal", "highly_formal", "diplomatic"]),
  tags: text("tags"), // JSON array of tags
  audioUrl: varchar("audioUrl", { length: 500 }),
  notes: text("notes"),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LanguageExample = typeof languageExamples.$inferSelect;
export type InsertLanguageExample = typeof languageExamples.$inferInsert;

/**
 * Language Transformations - Informal to Formal mappings
 */
export const languageTransformations = mysqlTable("language_transformations", {
  id: int("id").autoincrement().primaryKey(),
  informalText: text("informalText").notNull(),
  informalLevel: int("informalLevel").notNull(), // 1-2 typically
  formalText: text("formalText").notNull(),
  formalLevel: int("formalLevel").notNull(), // 4-5 typically
  explanationRu: text("explanationRu"),
  explanationEn: text("explanationEn"),
  category: varchar("category", { length: 100 }),
  usageNotes: text("usageNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LanguageTransformation = typeof languageTransformations.$inferSelect;
export type InsertLanguageTransformation = typeof languageTransformations.$inferInsert;

/**
 * AI Training Sessions - Track AI entity training progress
 */
export const trainingSessions = mysqlTable("training_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  aiEntityName: varchar("aiEntityName", { length: 255 }),
  aiEntityVersion: varchar("aiEntityVersion", { length: 50 }),
  moduleId: int("moduleId"),
  levelId: int("levelId"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  examplesProcessed: int("examplesProcessed").default(0),
  accuracy: int("accuracy"), // percentage 0-100
  status: mysqlEnum("status", ["in_progress", "completed", "paused", "failed"]).default("in_progress"),
  metadata: text("metadata"), // JSON for additional data
});

export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = typeof trainingSessions.$inferInsert;

/**
 * Training Metrics - Performance analytics
 */
export const trainingMetrics = mysqlTable("training_metrics", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  metricType: varchar("metricType", { length: 100 }).notNull(),
  metricValue: int("metricValue").notNull(),
  levelId: int("levelId"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type TrainingMetric = typeof trainingMetrics.$inferSelect;
export type InsertTrainingMetric = typeof trainingMetrics.$inferInsert;

/**
 * API Access Logs - Track institutional API usage
 */
export const apiAccessLogs = mysqlTable("api_access_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  requestCount: int("requestCount").default(1),
  responseTime: int("responseTime"), // in ms
  statusCode: int("statusCode"),
  accessedAt: timestamp("accessedAt").defaultNow().notNull(),
});

export type ApiAccessLog = typeof apiAccessLogs.$inferSelect;
export type InsertApiAccessLog = typeof apiAccessLogs.$inferInsert;
