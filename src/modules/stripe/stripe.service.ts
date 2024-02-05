import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from 'src/entity/booking.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    bookingId: number,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Booking',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId,
      },
    });

    return session;
  }

  async constructEvent(payload: any, sig: string): Promise<any> {
    return this.stripe.webhooks.constructEvent(
      payload,
      sig,
      'whsec_Oyym7ttQ51TqyBIVVQKGAOL3aFEyIyWL',
    );
  }

  async handleSuccessfulPayment(bookingId: number): Promise<BookingEntity> {
    try {
      // Extract relevant information from the checkout session metadata

      if (!bookingId) {
        throw new NotFoundException('Bookingid not found');
      }
      const booking = await this.bookingRepository.findOneBy({ id: bookingId });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      booking.status = 2;
      await this.bookingRepository.save(booking);
      return booking;
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw new Error(`Error handling successful payment: ${error.message}`);
    }
  }

  async verifyPayment(paymentIntentId: string): Promise<boolean> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  }
}
