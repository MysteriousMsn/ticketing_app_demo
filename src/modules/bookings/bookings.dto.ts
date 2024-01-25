import { z } from 'zod';

export const createBookingSchema = z.object({
    userId: z.number({ required_error: 'User id is required' }).positive(),
    seatId: z.number({ required_error: 'Seat id is required' }).positive(),
    venueId: z.number({ required_error: 'Venue id is required' }).positive(),
    movieId: z.number({ required_error: 'Movie id is required' }).positive(),
    ticketId: z.number({ required_error: 'Ticket id is required' }).positive(),
  });

export type CreateBookingDto = z.infer<typeof createBookingSchema>;