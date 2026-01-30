import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { languageExamples } from "../../drizzle/schema";

export const adminRouter = router({
  /**
   * Get generated lessons for review
   */
  getGeneratedLessons: adminProcedure
    .input(
      z.object({
        status: z.enum(["all", "pending", "approved", "rejected"]).default("pending"),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db.select().from(languageExamples).limit(input.limit);

      return results.map((item) => ({
        id: item.id.toString(),
        category: item.scenario || "general",
        contentRu: item.textRu,
        contentEn: item.textEn || "",
        level: item.levelId,
        status: (item.isVerified ? "approved" : "pending") as "pending" | "approved" | "rejected",
        createdAt: item.createdAt,
        notes: item.notes || undefined,
      }));
    }),

  /**
   * Approve a lesson
   */
  approveLesson: adminProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const lessonId = parseInt(input.lessonId);

      await db
        .update(languageExamples)
        .set({
          isVerified: true,
          createdAt: new Date(),
        })
        .where(eq(languageExamples.id, lessonId));

      return { success: true };
    }),

  /**
   * Reject a lesson
   */
  rejectLesson: adminProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const lessonId = parseInt(input.lessonId);

      await db
        .update(languageExamples)
        .set({
          isVerified: false,
          createdAt: new Date(),
        })
        .where(eq(languageExamples.id, lessonId));

      return { success: true };
    }),

  /**
   * Update lesson notes
   */
  updateLessonNotes: adminProcedure
    .input(
      z.object({
        lessonId: z.string(),
        notes: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const lessonId = parseInt(input.lessonId);

      await db
        .update(languageExamples)
        .set({
          notes: input.notes,
          createdAt: new Date(),
        })
        .where(eq(languageExamples.id, lessonId));

      return { success: true };
    }),

  /**
   * Get statistics
   */
  getStatistics: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { pending: 0, approved: 0, rejected: 0, total: 0 };

    const all = await db.select().from(languageExamples);

    return {
      pending: all.filter((l) => !l.isVerified).length,
      approved: all.filter((l) => l.isVerified).length,
      rejected: 0,
      total: all.length,
    };
  }),

  /**
   * Batch approve lessons
   */
  batchApprove: adminProcedure
    .input(z.object({ lessonIds: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, count: 0 };

      const ids = input.lessonIds.map((id) => parseInt(id));

      for (const id of ids) {
        await db
          .update(languageExamples)
          .set({
            isVerified: true,
            createdAt: new Date(),
          })
          .where(eq(languageExamples.id, id));
      }

      return { success: true, count: ids.length };
    }),

  /**
   * Export approved lessons
   */
  exportApprovedLessons: adminProcedure
    .input(
      z.object({
        format: z.enum(["json", "csv"]).default("json"),
        levelFilter: z.array(z.number()).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { data: "", format: input.format };

      const results = await db.select().from(languageExamples).where(eq(languageExamples.isVerified, true));

      if (input.format === "json") {
        return {
          data: JSON.stringify(results, null, 2),
          format: "json",
        };
      } else {
        // CSV format
        const headers = ["ID", "Level", "Russian", "English", "Category", "Tone"];
        const rows = results.map((r) => [
          r.id,
          r.levelId,
          `"${r.textRu}"`,
          `"${r.textEn}"`,
          r.scenario,
          r.tone,
        ]);
        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
        return { data: csv, format: "csv" };
      }
    }),
});
