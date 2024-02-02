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
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z.object({
  seatIds: z.array(
    z.number({ required_error: 'Seat id is required' }).positive(),
  ),
  totalSeats: z
    .number({ required_error: 'Total seats are required' })
    .positive(),
  venueId: z.number({ required_error: 'Venue id is required' }).positive(),
  movieId: z.number({ required_error: 'Movie id is required' }).positive(),
  bookingUpdatedDate: z.string({
    required_error: 'Seat updated date is required',
  }),
});

export type UpdateBookingDto = z.infer<typeof updateBookingSchema>;
