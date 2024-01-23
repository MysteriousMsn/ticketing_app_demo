// event.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './events.dto';
import { EventEntity } from 'src/entity/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async findAll(): Promise<EventEntity[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<EventEntity | undefined> {
    return this.eventRepository.findOneBy({id});
  }

  async create(createEventDto: CreateEventDto): Promise<EventEntity> {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<EventEntity> {
    const existingEvent = await this.eventRepository.findOneBy({id});

    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }

    this.eventRepository.merge(existingEvent, updateEventDto);

    return this.eventRepository.save(existingEvent);
  }

  async remove(id: number): Promise<void> {
    const event = await this.eventRepository.findOneBy({id});

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.eventRepository.remove(event);
  }
}
