import { eq, like, and, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  languageLevels, InsertLanguageLevel,
  trainingModules, InsertTrainingModule,
  languageExamples, InsertLanguageExample,
  languageTransformations, InsertLanguageTransformation,
  trainingSessions, InsertTrainingSession,
  trainingMetrics, InsertTrainingMetric,
  apiAccessLogs, InsertApiAccessLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER HELPERS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ LANGUAGE LEVELS ============

export async function getAllLanguageLevels() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(languageLevels).orderBy(asc(languageLevels.level));
}

export async function getLanguageLevelById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(languageLevels).where(eq(languageLevels.id, id)).limit(1);
  return result[0];
}

export async function createLanguageLevel(data: InsertLanguageLevel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(languageLevels).values(data);
}

// ============ TRAINING MODULES ============

export async function getAllTrainingModules(levelId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (levelId) {
    return db.select().from(trainingModules)
      .where(eq(trainingModules.levelId, levelId))
      .orderBy(desc(trainingModules.createdAt));
  }
  return db.select().from(trainingModules).orderBy(desc(trainingModules.createdAt));
}

export async function getTrainingModuleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(trainingModules).where(eq(trainingModules.id, id)).limit(1);
  return result[0];
}

export async function createTrainingModule(data: InsertTrainingModule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(trainingModules).values(data);
}

export async function updateTrainingModule(id: number, data: Partial<InsertTrainingModule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(trainingModules).set(data).where(eq(trainingModules.id, id));
}

// ============ LANGUAGE EXAMPLES ============

export async function getLanguageExamples(filters: { moduleId?: number; levelId?: number; scenario?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (filters.moduleId) conditions.push(eq(languageExamples.moduleId, filters.moduleId));
  if (filters.levelId) conditions.push(eq(languageExamples.levelId, filters.levelId));
  if (filters.scenario) conditions.push(eq(languageExamples.scenario, filters.scenario));
  
  let query = db.select().from(languageExamples);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }
  
  return query.limit(filters.limit || 50).offset(filters.offset || 0);
}

export async function createLanguageExample(data: InsertLanguageExample) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(languageExamples).values(data);
}

export async function searchLanguageExamples(searchTerm: string, levelId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [like(languageExamples.textRu, `%${searchTerm}%`)];
  if (levelId) conditions.push(eq(languageExamples.levelId, levelId));
  
  return db.select().from(languageExamples).where(and(...conditions)).limit(100);
}

// ============ LANGUAGE TRANSFORMATIONS ============

export async function getAllTransformations(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(languageTransformations).limit(limit).offset(offset);
}

export async function createTransformation(data: InsertLanguageTransformation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(languageTransformations).values(data);
}

// ============ TRAINING SESSIONS ============

export async function getUserTrainingSessions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(trainingSessions)
    .where(eq(trainingSessions.userId, userId))
    .orderBy(desc(trainingSessions.startedAt));
}

export async function createTrainingSession(data: InsertTrainingSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(trainingSessions).values(data);
  return result;
}

export async function updateTrainingSession(id: number, data: Partial<InsertTrainingSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(trainingSessions).set(data).where(eq(trainingSessions.id, id));
}

// ============ TRAINING METRICS ============

export async function getSessionMetrics(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(trainingMetrics).where(eq(trainingMetrics.sessionId, sessionId));
}

export async function createTrainingMetric(data: InsertTrainingMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(trainingMetrics).values(data);
}

// ============ API ACCESS LOGS ============

export async function logApiAccess(data: InsertApiAccessLog) {
  const db = await getDb();
  if (!db) return;
  await db.insert(apiAccessLogs).values(data);
}

export async function getApiAccessStats(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(apiAccessLogs)
    .where(eq(apiAccessLogs.userId, userId))
    .orderBy(desc(apiAccessLogs.accessedAt))
    .limit(100);
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalModules: 0, totalExamples: 0, totalSessions: 0, totalUsers: 0 };
  
  const [modulesCount] = await db.select({ count: sql<number>`count(*)` }).from(trainingModules);
  const [examplesCount] = await db.select({ count: sql<number>`count(*)` }).from(languageExamples);
  const [sessionsCount] = await db.select({ count: sql<number>`count(*)` }).from(trainingSessions);
  const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  
  return {
    totalModules: modulesCount?.count || 0,
    totalExamples: examplesCount?.count || 0,
    totalSessions: sessionsCount?.count || 0,
    totalUsers: usersCount?.count || 0,
  };
}
