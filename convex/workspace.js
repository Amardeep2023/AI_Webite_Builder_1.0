import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
    args:{
        messages:v.any(),
        user:v.id("users"),
    },
    handler:async(ctx ,args)=>{

        const workspaceid=await ctx.db.insert("workspace",{
            messages:args.messages,
            user:args.user,
        });
        return workspaceid;
    }
})

export const GetWorkspace=query({
    args:{
        workspaceid:v.id('workspace'),
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.get(args.workspaceid);
        return result;
    }

})

export const UpdateMeassages = mutation({
    args:{
        workspaceid:v.id('workspace'),
        messages:v.any(),

     },
     handler:async(ctx,args)=>{
        const result=await ctx.db.patch(args.workspaceid,{
            messages:args.messages,
        })
        return result;
     }
})

export const UpdateFiles = mutation({
    args:{
        workspaceid:v.id('workspace'),
        files:v.any(),

     },
     handler:async(ctx,args)=>{
        const result=await ctx.db.patch(args.workspaceid,{
            fileData:args.files,
        })
        return result;
     }
})

export const GetAllWorkspace=query({
    args:{
        userid:v.id('users'),

    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.query('workspace')
        .filter(q=>q.eq(q.field('user'),args.userid))
        .collect();

        return result;
    }
})