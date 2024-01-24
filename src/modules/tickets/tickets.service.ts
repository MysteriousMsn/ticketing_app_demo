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

  async findAll(): Promise<TicketEntity[]> {
    return this.ticketRepository.find();
  }

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

      const existingTicket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.seat = :seat', { seat: seat.id })
      .getOne();
  
    if (existingTicket) {
      throw new BadRequestException('Ticket already exists for the specified seat');
    }
   
    const newTicket = this.ticketRepository.create({
      name: ticketDto.name,
      price: ticketDto.price,
      seat,
      venue,
    });
    return this.ticketRepository.save(newTicket);
  }

  async updateTicket(ticketId: string, ticketDto: TicketDto): Promise<TicketEntity> {
    const venue = await this.venueRepository
      .createQueryBuilder('venue')
      .innerJoinAndSelect('venue.seats', 'seats')
      .where('venue.id = :venueId', { venueId: ticketDto.venue })
      .andWhere('seats.id = :seatId', { seatId: ticketDto.seat })
      .getOne();

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }
    const seat = venue.seats.find((s) => s.id === ticketDto.seat);
    const existingTicket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.id = :id', { id: ticketId })
      .getOne();

    if (!existingTicket) {
      throw new NotFoundException('Ticket not found');
    }

    existingTicket.name = ticketDto.name;
    existingTicket.price = ticketDto.price;
    existingTicket.seat = seat;
    existingTicket.venue = venue;

    return this.ticketRepository.save(existingTicket);
  }

  async getTicketsByVenue(venueId: string): Promise<TicketEntity[]> {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.venue', 'venue')
      .where('venue.id = :venueId', { venueId })
      .getMany();
  }

  async findById(id: number): Promise<TicketEntity> {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async delete(id: number): Promise<void> {
    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
  }
}
