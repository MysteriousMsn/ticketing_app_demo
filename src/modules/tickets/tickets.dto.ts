// event.dto.ts
import { z } from 'zod';

export const TicketSchema = z.object({
  name: z.string().min(1).toLowerCase().trim(),
  price: z.number().min(1),
  venue: z.number().min(1),
});
export type TicketDto = z.infer<typeof TicketSchema>;
