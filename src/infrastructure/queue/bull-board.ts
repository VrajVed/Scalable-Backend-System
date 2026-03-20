import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import { Queues } from "./queue.registry";

export const bullBoardAdapter = new FastifyAdapter();

createBullBoard({
  queues: Object.values(Queues).map((q) => new BullMQAdapter(q)),
  serverAdapter: bullBoardAdapter,
});

bullBoardAdapter.setBasePath("/admin/queues");
