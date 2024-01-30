import { z } from 'zod';

export const createBookingSchema = z.object({
  seatIds: z.array(
    z.number({ required_error: 'Seat id is required' }).positive(),
  ),
  totalSeats: z
    .number({ required_error: 'Total seats are required' })
    .positive(),
  venueId: z.number({ required_error: 'Venue id is required' }).positive(),
  movieId: z.number({ required_error: 'Movie id is required' }).positive(),
  ticketId: z.number({ required_error: 'Ticket id is required' }).positive(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;

export const updateLocationSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  status: z.number({ required_error: 'Status is required' }),
});

export type UpdateLocationDto = z.infer<typeof updateLocationSchema>;
