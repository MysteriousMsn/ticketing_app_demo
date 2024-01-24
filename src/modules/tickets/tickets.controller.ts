// ticket.controller.ts

import { Controller, Post, Get, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { VenuesService } from '../venues/venues.service';
import { TicketEntity } from 'src/entity/ticket.entity';
import { TicketDto, TicketSchema } from './tickets.dto';
import { ZodValidationPipe } from 'src/utils/zod.validation';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketService: TicketsService,
    private readonly venueService: VenuesService,
  ) {}

  @Post()
  async createTicket(@Body(new ZodValidationPipe(TicketSchema)) ticketDto: TicketDto): Promise<TicketEntity> {
    return this.ticketService.createTicket(ticketDto);
  }

  @Get(':venueId')
  async getTicketsByVenue(@Param('venueId', ParseUUIDPipe) venueId: string): Promise<TicketEntity[]> {
    return this.ticketService.getTicketsByVenue(venueId);
  }
}
