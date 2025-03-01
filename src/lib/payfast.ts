import crypto from 'crypto';

interface PayfastConfig {
  merchantId: string;
  merchantKey: string;
  passPhrase?: string;
  returnUrl?: string;
  cancelUrl?: string;
  notifyUrl?: string;
  emailConfirmation?: boolean;
  confirmationAddress?: string;
  paymentMethod?: 'cc' | 'dc' | 'ef' | 'mp' | 'mc' | 'sc' | 'ss' | 'zp' | 'mt' | 'rc' | 'mu' | 'ap' | 'sp' | 'cp';
  sandbox?: boolean;
}

interface PaymentData {
  amount: number;
  itemName: string;
  itemDescription?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  cellNumber?: string;
  customStr1?: string;
  customStr2?: string;
  customStr3?: string;
  customStr4?: string;
  customStr5?: string;
  customInt1?: number;
  customInt2?: number;
  customInt3?: number;
  customInt4?: number;
  customInt5?: number;
  mPaymentId?: string;
  ficaIdNumber?: string;
}

export class PayfastService {
  private config: PayfastConfig;
  private baseUrl: string;

  constructor(config: PayfastConfig) {
    this.config = config;
    this.baseUrl = config.sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';
  }

  generateSignature(data: Record<string, string>): string {
    // Create parameter string
    let pfOutput = '';
    for (const key in data) {
      if (data[key] !== '') {
        pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`;
      }
    }

    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);

    // Add passphrase if set
    if (this.config.passPhrase) {
      getString += `&passphrase=${encodeURIComponent(this.config.passPhrase.trim()).replace(/%20/g, '+')}`;
    }

    // Generate signature
    return crypto.createHash('md5').update(getString).digest('hex');
  }

  generatePaymentForm(payment: PaymentData): string {
    const data: Record<string, string> = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      amount: payment.amount.toFixed(2),
      item_name: payment.itemName,
    };

    // Add optional fields
    if (this.config.returnUrl) data.return_url = this.config.returnUrl;
    if (this.config.cancelUrl) data.cancel_url = this.config.cancelUrl;
    if (this.config.notifyUrl) data.notify_url = this.config.notifyUrl;
    if (this.config.emailConfirmation) data.email_confirmation = '1';
    if (this.config.confirmationAddress) data.confirmation_address = this.config.confirmationAddress;
    if (this.config.paymentMethod) data.payment_method = this.config.paymentMethod;

    if (payment.itemDescription) data.item_description = payment.itemDescription;
    if (payment.email) data.email_address = payment.email;
    if (payment.firstName) data.name_first = payment.firstName;
    if (payment.lastName) data.name_last = payment.lastName;
    if (payment.cellNumber) data.cell_number = payment.cellNumber;
    if (payment.mPaymentId) data.m_payment_id = payment.mPaymentId;
    if (payment.ficaIdNumber) data.fica_idnumber = payment.ficaIdNumber;
    
    if (payment.customStr1) data.custom_str1 = payment.customStr1;
    if (payment.customStr2) data.custom_str2 = payment.customStr2;
    if (payment.customStr3) data.custom_str3 = payment.customStr3;
    if (payment.customStr4) data.custom_str4 = payment.customStr4;
    if (payment.customStr5) data.custom_str5 = payment.customStr5;
    if (payment.customInt1) data.custom_int1 = payment.customInt1.toString();
    if (payment.customInt2) data.custom_int2 = payment.customInt2.toString();
    if (payment.customInt3) data.custom_int3 = payment.customInt3.toString();
    if (payment.customInt4) data.custom_int4 = payment.customInt4.toString();
    if (payment.customInt5) data.custom_int5 = payment.customInt5.toString();

    // Generate signature
    data.signature = this.generateSignature(data);

    // Generate HTML form
    let formHtml = `<form action="${this.baseUrl}" method="post">`;
    for (const key in data) {
      formHtml += `<input type="hidden" name="${key}" value="${data[key]}" />`;
    }
    formHtml += '</form>';

    return formHtml;
  }

  validateCallback(pfData: Record<string, string>): boolean {
    // Validate signature
    const signature = this.generateSignature(pfData);
    if (signature !== pfData.signature) {
      return false;
    }

    // Validate data
    const requiredFields = ['m_payment_id', 'pf_payment_id', 'payment_status', 'item_name'];
    for (const field of requiredFields) {
      if (!pfData[field]) {
        return false;
      }
    }

    return true;
  }
}