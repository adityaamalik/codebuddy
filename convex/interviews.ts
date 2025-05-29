import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// get all interviews
export const getInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        const interviews = await ctx.db.query("interviews").collect();
        return interviews;
    }
});

// get an interview by id
export const getMyInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const interviews = 
            await ctx.db
            .query("interviews")
            .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
            .collect();
            
        return interviews!;
    }
});

// get interview by stream call id
export const getInterviewByStreamCallId = query({
    args: {
        streamCallId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("interviews").filter((q) => q.eq(q.field("streamCallId"), args.streamCallId)).first();
    }
});

// create an interview
export const createInterview = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        status: v.string(),
        streamCallId: v.string(),
        candidateId: v.string(),
        interviewerIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        return await ctx.db.insert("interviews", {
            ...args,
        });
    },
});

export const updateInterviewStatus = mutation({
    args: {
        id: v.id("interviews"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        return await ctx.db.patch(args.id, {
            status: args.status,
            ...(args.status == "completed" ? { endTime: Date.now() } : {}),
        });
    },
});