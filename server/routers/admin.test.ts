import { describe, it, expect, vi, beforeEach } from "vitest";
import { adminRouter } from "./admin";
import type { TrpcContext } from "../_core/context";

// Mock database
vi.mock("../db", () => ({
  getDb: vi.fn(),
}));

type AdminUser = NonNullable<TrpcContext["user"]> & { role: "admin" };

function createAdminContext(): { ctx: TrpcContext } {
  const user: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("admin router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow admin to access statistics", async () => {
    const { ctx } = createAdminContext();
    const caller = adminRouter.createCaller(ctx);

    // This should not throw
    const stats = await caller.getStatistics();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("pending");
    expect(stats).toHaveProperty("approved");
    expect(stats).toHaveProperty("total");
  });

  it("should allow admin to get generated lessons", async () => {
    const { ctx } = createAdminContext();
    const caller = adminRouter.createCaller(ctx);

    const lessons = await caller.getGeneratedLessons({ status: "pending" });

    expect(Array.isArray(lessons)).toBe(true);
  });

  it("should allow admin to approve a lesson", async () => {
    const { ctx } = createAdminContext();
    const caller = adminRouter.createCaller(ctx);

    const result = await caller.approveLesson({ lessonId: "1" });

    expect(result).toHaveProperty("success");
  });

  it("should allow admin to reject a lesson", async () => {
    const { ctx } = createAdminContext();
    const caller = adminRouter.createCaller(ctx);

    const result = await caller.rejectLesson({ lessonId: "1" });

    expect(result).toHaveProperty("success");
  });

  it("should allow admin to update lesson notes", async () => {
    const { ctx } = createAdminContext();
    const caller = adminRouter.createCaller(ctx);

    const result = await caller.updateLessonNotes({
      lessonId: "1",
      notes: "Test notes",
    });

    expect(result).toHaveProperty("success");
  });

  it("should allow admin to batch approve lessons", async () => {
    const { ctx } = createAdminContext();
    const caller = adminRouter.createCaller(ctx);

    const result = await caller.batchApprove({
      lessonIds: ["1", "2", "3"],
    });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("count");
  });

  it("should allow admin to export approved lessons as JSON", async () => {
    const { ctx } = createAdminContext();
    const caller = adminRouter.createCaller(ctx);

    const result = await caller.exportApprovedLessons({
      format: "json",
    });

    expect(result).toHaveProperty("data");
    expect(result.format).toBe("json");
  });

  it("should allow admin to export approved lessons as CSV", async () => {
    const { ctx } = createAdminContext();
    const caller = adminRouter.createCaller(ctx);

    const result = await caller.exportApprovedLessons({
      format: "csv",
    });

    expect(result).toHaveProperty("data");
    expect(result.format).toBe("csv");
  });
});
