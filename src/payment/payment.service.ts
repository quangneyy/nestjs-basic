import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentService {
    constructor(private readonly httpService: HttpService) { }

    async createPayment(paymentRequest: any): Promise<string> {
        const endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';

        try {
            const response = await this.httpService.post(endpoint, paymentRequest).toPromise();
            const payUrl = response.data.payUrl;
            return payUrl;
        } catch (error) {
            throw new Error(`Error creating payment: ${error.message}`);
        }
    }
}