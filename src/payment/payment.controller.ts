// payment.controller.ts
import { Controller, Post, Body, Redirect, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @Redirect('', 302)
    async createPayment(@Body() paymentRequest: any): Promise<{ url: string }> {
        try {
            const payUrl = await this.paymentService.createPayment(paymentRequest);
            return { url: payUrl };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}