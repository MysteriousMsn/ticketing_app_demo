import {
  Body,
  Controller,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { StripeService } from './stripe.service';
import { Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {} // Inject your Stripe service

  @Post('webhook')
  @Public()
  async webhook(
    @Req() request: RawBodyRequest<Request>,
    @Res() response: Response,
    @Body() webhookPayload: any,
  ) {
    const sig = request.headers['stripe-signature'];
    console.log(webhookPayload, 'webhookPayload');
    try {
      const event = await this.stripeService.constructEvent(
        request.rawBody,
        sig,
      );
      let finalData;
      switch (event.type) {
        case 'checkout.session.async_payment_failed':
          const checkoutSessionAsyncPaymentFailed = event.data.object;
          // Then define and call a function to handle the event checkout.session.async_payment_failed
          break;
        case 'checkout.session.async_payment_succeeded':
          const checkoutSessionAsyncPaymentSucceeded = event.data.object;
          // Then define and call a function to handle the event checkout.session.async_payment_succeeded
          break;
        case 'checkout.session.completed':
          const checkoutSessionCompleted = event.data.object;
          const bookingId = checkoutSessionCompleted?.metadata?.bookingId;
          finalData =
            await this.stripeService.handleSuccessfulPayment(bookingId);
          break;
        case 'checkout.session.expired':
          const checkoutSessionExpired = event.data.object;
          // Then define and call a function to handle the event checkout.session.expired
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return response.status(HttpStatus.OK).send({ data: finalData });
    } catch (err) {
      console.error('Error handling webhook event:', err);

      // Return a 400 response in case of an error
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }
  }
}
