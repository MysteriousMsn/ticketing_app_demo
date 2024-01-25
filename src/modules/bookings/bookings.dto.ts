import { z } from 'zod';

export const createBookingSchema = z.object({
    userId: z.number({ required_error: 'User id is required' }),
    seatId: z.number({ required_error: 'Seat id is required' }),
    venueId: z.number({ required_error: 'Venue id is required' }),
    movieId: z.number({ required_error: 'Movie id is required' }),
    ticketId: z.number({ required_error: 'Ticket id is required' }),
  });

export type CreateBookingDto = z.infer<typeof createBookingSchema>;