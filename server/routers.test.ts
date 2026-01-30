import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createLanguageLevel: vi.fn().mockResolvedValue({ success: true }),
  getAllLanguageLevels: vi.fn().mockResolvedValue([
    { id: 1, level: 1, starRating: 1, nameRu: "Уличный русский", nameEn: "Street Russian" },
    { id: 2, level: 2, starRating: 2, nameRu: "Разговорный русский", nameEn: "Casual Russian" },
    { id: 3, level: 3, starRating: 3, nameRu: "Деловой русский", nameEn: "Professional Russian" },
    { id: 4, level: 4, starRating: 4, nameRu: "Официальный русский", nameEn: "Formal Russian" },
    { id: 5, level: 5, starRating: 5, nameRu: "Дипломатический русский", nameEn: "Diplomatic Russian" },
  ]),
  getLanguageLevelById: vi.fn().mockResolvedValue({
    id: 1, level: 1, starRating: 1, nameRu: "Уличный русский", nameEn: "Street Russian"
  }),
  getAllTrainingModules: vi.fn().mockResolvedValue([
    { id: 1, levelId: 1, title: "Street Slang Basics", category: "vocabulary" },
    { id: 2, levelId: 2, title: "Everyday Conversations", category: "conversation" },
  ]),
  getTrainingModuleById: vi.fn().mockResolvedValue({
    id: 1, levelId: 1, title: "Street Slang Basics", category: "vocabulary"
  }),
  getLanguageExamples: vi.fn().mockResolvedValue([
    { id: 1, textRu: "Чё как?", textEn: "What's up?", levelId: 1 },
    { id: 2, textRu: "Как дела?", textEn: "How are you?", levelId: 2 },
  ]),
  searchLanguageExamples: vi.fn().mockResolvedValue([
    { id: 1, textRu: "Привет", textEn: "Hello", levelId: 2 },
  ]),
  getAllTransformations: vi.fn().mockResolvedValue([
    { id: 1, informalText: "Чё как?", formalText: "Как Ваши дела?", informalLevel: 1, formalLevel: 4 },
  ]),
  getUserTrainingSessions: vi.fn().mockResolvedValue([
    { id: 1, aiEntityName: "GPT-4", status: "completed", examplesProcessed: 100 },
  ]),
  getDashboardStats: vi.fn().mockResolvedValue({
    totalModules: 16,
    totalExamples: 2380,
    totalSessions: 47,
    totalUsers: 12,
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthenticatedContext(role: "user" | "admin" | "institution" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@institution.gov",
    name: "Test User",
    loginMethod: "manus",
    role: role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Prize2Pride API - Language Levels", () => {
  it("should return all 5 language levels", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const levels = await caller.levels.list();

    expect(levels).toHaveLength(5);
    expect(levels[0]).toHaveProperty("nameRu");
    expect(levels[0]).toHaveProperty("nameEn");
    expect(levels[0]).toHaveProperty("starRating");
  });

  it("should return a specific level by ID", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const level = await caller.levels.getById({ id: 1 });

    expect(level).toBeDefined();
    expect(level?.nameEn).toBe("Street Russian");
    expect(level?.starRating).toBe(1);
  });
});

describe("Prize2Pride API - Training Modules", () => {
  it("should return training modules", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const modules = await caller.modules.list();

    expect(modules).toBeInstanceOf(Array);
    expect(modules.length).toBeGreaterThan(0);
    expect(modules[0]).toHaveProperty("title");
    expect(modules[0]).toHaveProperty("category");
  });

  it("should filter modules by level", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const modules = await caller.modules.list({ levelId: 1 });

    expect(modules).toBeInstanceOf(Array);
  });
});

describe("Prize2Pride API - Language Examples", () => {
  it("should return language examples", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const examples = await caller.examples.list();

    expect(examples).toBeInstanceOf(Array);
    expect(examples.length).toBeGreaterThan(0);
    expect(examples[0]).toHaveProperty("textRu");
    expect(examples[0]).toHaveProperty("textEn");
  });

  it("should search examples by query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.examples.search({ query: "привет" });

    expect(results).toBeInstanceOf(Array);
  });
});

describe("Prize2Pride API - Language Transformations", () => {
  it("should return transformations", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const transformations = await caller.transformations.list();

    expect(transformations).toBeInstanceOf(Array);
    expect(transformations[0]).toHaveProperty("informalText");
    expect(transformations[0]).toHaveProperty("formalText");
    expect(transformations[0]).toHaveProperty("informalLevel");
    expect(transformations[0]).toHaveProperty("formalLevel");
  });
});

describe("Prize2Pride API - Protected Routes", () => {
  it("should return training sessions for authenticated user", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    const sessions = await caller.sessions.list();

    expect(sessions).toBeInstanceOf(Array);
  });

  it("should return dashboard stats for authenticated user", async () => {
    const ctx = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.dashboard.stats();

    expect(stats).toHaveProperty("totalModules");
    expect(stats).toHaveProperty("totalExamples");
    expect(stats).toHaveProperty("totalSessions");
    expect(stats).toHaveProperty("totalUsers");
  });

  it("should deny access to sessions for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.sessions.list()).rejects.toThrow();
  });
});

describe("Prize2Pride API - Admin Routes", () => {
  it("should allow admin to create language level", async () => {
    const ctx = createAuthenticatedContext("admin");
    const caller = appRouter.createCaller(ctx);

    // This would normally create a level, but we're testing the access control
    const newLevel = {
      level: 5,
      starRating: 5,
      nameRu: "Тест",
      nameEn: "Test",
      description: "Test level",
    };

    // The mock will handle this, we're testing that admin access works
    await expect(caller.levels.create(newLevel)).resolves.toBeDefined();
  });

  it("should deny non-admin from creating levels", async () => {
    const ctx = createAuthenticatedContext("user");
    const caller = appRouter.createCaller(ctx);

    const newLevel = {
      level: 5,
      starRating: 5,
      nameRu: "Тест",
      nameEn: "Test",
      description: "Test level",
    };

    await expect(caller.levels.create(newLevel)).rejects.toThrow("You do not have required permission");
  });
});
