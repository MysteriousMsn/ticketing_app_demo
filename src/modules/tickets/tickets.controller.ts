// ticket.controller.ts

import { Controller, Post, Get, Param, Body, ParseUUIDPipe, Put, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { VenuesService } from '../venues/venues.service';
import { TicketEntity } from 'src/entity/ticket.entity';
import { TicketDto, TicketSchema } from './tickets.dto';
import { ZodValidationPipe } from 'src/utils/zod.validation';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketService: TicketsService,
  ) {}

  @Get()
  async findAll(): Promise<TicketEntity[]> {
    return this.ticketService.findAll();
  }
  @Get(':id')
  async findById(@Param('id') id: string): Promise<TicketEntity | undefined> {
    return this.ticketService.findById(Number(id));
  }
  @Get('venue/:venueId')
  async getTicketsByVenue(@Param('venueId') venueId: string): Promise<TicketEntity[]> {
    return this.ticketService.getTicketsByVenue(venueId);
  }
  @Post()
  async createTicket(@Body(new ZodValidationPipe(TicketSchema)) ticketDto: TicketDto): Promise<TicketEntity> {
    return this.ticketService.createTicket(ticketDto);
  }
  @Put(':id')
  async updateTicket(@Param('id') ticketId: string, @Body(new ZodValidationPipe(TicketSchema)) ticketDto: TicketDto): Promise<TicketEntity> {
    return this.ticketService.updateTicket(ticketId, ticketDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.ticketService.delete(Number(id));
  }
}
