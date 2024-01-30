import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatEntity } from 'src/entity/seat.entity';
import { VenueEntity } from 'src/entity/venue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  async createSeatsForVenue(venue: VenueEntity): Promise<void> {
    const rows = ['A', 'B'];
    const columns = Array.from({ length: 2 }, (_, index) =>
      (index + 1).toString(),
    );

    const seats: SeatEntity[] = [];

    rows.forEach((row) => {
      columns.forEach((column) => {
        const seatNumber = `${row}${column}`;
        const newSeat = this.seatRepository.create({
          seatNumber,
          row,
          column,
          isReserved: false,
          venue,
        });
        seats.push(newSeat);
      });
    });

    await this.seatRepository.save(seats);
  }
}
