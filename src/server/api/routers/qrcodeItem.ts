import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const QrcodeItemRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    create: protectedProcedure
        .input(z.object({ name: z.string().min(1), qrcode: z.string().min(1) }))
        .mutation(({ ctx, input }) => {
            return ctx.db.qrcode_Item.create({
                data: {
                    name: input.name,
                    qrcode: input.qrcode,
                    createdBy: { connect: { id: ctx.session.user.id } },
                },
            });
        }),

    getAllByPage: protectedProcedure.input(z.object({ pageNum: z.number(), pageSize: z.number() })).query(({ ctx, input }) => {
        const { pageNum, pageSize } = input;
        const skip = (pageNum - 1) * pageSize;
        const take = pageSize;
        return ctx.db.qrcode_Item.findMany({
            where: { createdBy: { id: ctx.session.user.id } },
            skip,
            take
        });
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => {
        return ctx.db.qrcode_Item.findUnique({
            where: { id: input.id },
        });
    }),

    updateById: protectedProcedure.input(z.object({ id: z.number(), name: z.string().min(1) })).mutation(({ ctx, input }) => {
        return ctx.db.qrcode_Item.update({
            where: { id: input.id },
            data: { name: input.name },
        });
    }),

    deleteById: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
        return ctx.db.qrcode_Item.delete({
            where: { id: input.id },
        });
    })
});