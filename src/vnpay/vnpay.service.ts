import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'querystring';

@Injectable()
export class VnpayService {
    private readonly vnpayEndpoint = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

    async generatePaymentUrl(orderId: string, amount: number): Promise<string> {
        // Your logic to generate the payment URL
        const vnp_Params = {
            vnp_TmnCode: 'YOUR_MERCHANT_CODE',
            vnp_Amount: amount * 100, // Convert amount to cents
            vnp_Command: 'pay',
            vnp_CreateDate: new Date().toISOString(),
            vnp_CurrCode: 'VND',
            vnp_Locale: 'vn',
            vnp_OrderInfo: 'Payment for Order ' + orderId,
            vnp_ReturnUrl: 'YOUR_RETURN_URL',
            vnp_TxnRef: orderId,
        };

        const secureHash = this.generateSecureHash(vnp_Params);
        vnp_Params['vnp_SecureHashType'] = 'SHA256';
        vnp_Params['vnp_SecureHash'] = secureHash;

        const paymentUrl = `${this.vnpayEndpoint}?${qs.stringify(vnp_Params)}`;
        return paymentUrl;
    }

    private generateSecureHash(params: any): string {
        // Your logic to generate the secure hash
        // Refer to VNPAY documentation for details
        return 'GENERATED_SECURE_HASH';
    }
}
