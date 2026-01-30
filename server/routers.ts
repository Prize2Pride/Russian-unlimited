import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'institution') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin or institution access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Language Levels (5-Star System)
  levels: router({
    list: publicProcedure.query(async () => {
      return db.getAllLanguageLevels();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getLanguageLevelById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        level: z.number().min(1).max(5),
        starRating: z.number().min(1).max(5),
        nameRu: z.string(),
        nameEn: z.string(),
        description: z.string(),
        characteristics: z.string().optional(),
        usageContext: z.string().optional(),
        colorCode: z.string().optional(),
        iconName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createLanguageLevel(input);
        return { success: true };
      }),
  }),

  // Training Modules
  modules: router({
    list: publicProcedure
      .input(z.object({ levelId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getAllTrainingModules(input?.levelId);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getTrainingModuleById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        levelId: z.number(),
        title: z.string(),
        titleRu: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["vocabulary", "phrases", "idioms", "grammar", "conversation", "formal_writing", "diplomatic"]),
        difficulty: z.enum(["beginner", "intermediate", "advanced", "expert", "master"]).optional(),
        estimatedDuration: z.number().optional(),
        requiredAccessLevel: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createTrainingModule(input);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          isActive: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateTrainingModule(input.id, input.data);
        return { success: true };
      }),
  }),

  // Language Examples
  examples: router({
    list: publicProcedure
      .input(z.object({
        moduleId: z.number().optional(),
        levelId: z.number().optional(),
        scenario: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getLanguageExamples(input || {});
      }),
    search: publicProcedure
      .input(z.object({
        query: z.string(),
        levelId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.searchLanguageExamples(input.query, input.levelId);
      }),
    create: adminProcedure
      .input(z.object({
        moduleId: z.number(),
        levelId: z.number(),
        textRu: z.string(),
        textEn: z.string().optional(),
        transliteration: z.string().optional(),
        context: z.string().optional(),
        scenario: z.string().optional(),
        tone: z.enum(["vulgar", "casual", "neutral", "formal", "highly_formal", "diplomatic"]).optional(),
        tags: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createLanguageExample(input);
        return { success: true };
      }),
  }),

  // Language Transformations (Informal ↔ Formal)
  transformations: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllTransformations(input?.limit, input?.offset);
      }),
    create: adminProcedure
      .input(z.object({
        informalText: z.string(),
        informalLevel: z.number(),
        formalText: z.string(),
        formalLevel: z.number(),
        explanationRu: z.string().optional(),
        explanationEn: z.string().optional(),
        category: z.string().optional(),
        usageNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createTransformation(input);
        return { success: true };
      }),
  }),

  // Training Sessions
  sessions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserTrainingSessions(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        aiEntityName: z.string().optional(),
        aiEntityVersion: z.string().optional(),
        moduleId: z.number().optional(),
        levelId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createTrainingSession({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          examplesProcessed: z.number().optional(),
          accuracy: z.number().optional(),
          status: z.enum(["in_progress", "completed", "paused", "failed"]).optional(),
          completedAt: z.date().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateTrainingSession(input.id, input.data);
        return { success: true };
      }),
  }),

  // Training Metrics
  metrics: router({
    getBySession: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        return db.getSessionMetrics(input.sessionId);
      }),
    create: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        metricType: z.string(),
        metricValue: z.number(),
        levelId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createTrainingMetric(input);
        return { success: true };
      }),
  }),

  // Dashboard Stats
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      return db.getDashboardStats();
    }),
    apiUsage: protectedProcedure.query(async ({ ctx }) => {
      return db.getApiAccessStats(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
