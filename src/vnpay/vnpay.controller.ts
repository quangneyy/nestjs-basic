import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { VnpayService } from './vnpay.service';

@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) { }

  @Get(':orderId/:amount')
  @Redirect()
  async generatePaymentUrl(
    @Param('orderId') orderId: string,
    @Param('amount') amount: number,
  ) {
    const paymentUrl = await this.vnpayService.generatePaymentUrl(orderId, amount);
    return { url: paymentUrl, statusCode: 302 };
  }
}