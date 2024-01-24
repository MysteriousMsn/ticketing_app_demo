import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from 'src/entity/ticket.entity';
import { VenueEntity } from 'src/entity/venue.entity';
import { Repository } from 'typeorm';
import { TicketDto } from './tickets.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(VenueEntity)
    private readonly venueRepository: Repository<VenueEntity>,
  ) {}

  async createTicket(ticketDto: TicketDto): Promise<TicketEntity> {
    
    const venue = await this.venueRepository
      .createQueryBuilder('venue')
      .innerJoinAndSelect('venue.seats', 'seats')
      .where('venue.id = :venueId', { venueId: ticketDto.venue })
      .andWhere('seats.id = :seatId', {seatId: ticketDto.seat})
      .getOne();

    if (!venue) {
      throw new NotFoundException('ticket not found');
    }
    const seat = venue.seats.find((s) => s.id === ticketDto.seat);
    if (!seat) {
      throw new NotFoundException('Seat not found in the specified venue');
    }

      const existingTicket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.seat = :seat', { seat: seat.id })
      .getOne();
  
    if (existingTicket) {
      throw new BadRequestException('Ticket already exists for the specified seat');
    }
    const ticket = {
      name: ticketDto.name,
      price: ticketDto.price,
    }
    const newTicket = this.ticketRepository.create({
      ...ticket,
      seat,
      venue,
    });

    return this.ticketRepository.save(newTicket);
  }

  async getTicketsByVenue(venueId: string): Promise<TicketEntity[]> {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.venue', 'venue')
      .where('venue.id = :venueId', { venueId })
      .getMany();
  }

  async getTicketById(ticketId: string): Promise<TicketEntity> {
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async deleteTicket(ticketId: string): Promise<void> {
    await this.getTicketById(ticketId); // Ensure the ticket exists
    await this.ticketRepository.delete(ticketId);
  }
}
