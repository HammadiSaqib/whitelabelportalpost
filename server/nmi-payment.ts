import crypto from 'crypto';
import fetch from 'node-fetch';

export interface NmiCredentials {
  username: string;
  password: string;
  securityKey: string;
  gatewayUrl: string;
  isTestMode: boolean;
}

export interface NmiPaymentRequest {
  amount: number;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  firstName: string;
  lastName: string;
  email: string;
  orderId?: string;
}

export interface NmiPaymentResponse {
  success: boolean;
  transactionId?: string;
  authCode?: string;
  message?: string;
  error?: string;
}

export class NmiPaymentProcessor {
  private credentials: NmiCredentials;

  constructor(credentials: NmiCredentials) {
    this.credentials = credentials;
  }

  /**
   * Process a payment through NMI Gateway
   */
  async processPayment(paymentData: NmiPaymentRequest): Promise<NmiPaymentResponse> {
    try {
      console.log('🔐 NMI Authentication Check:', {
        username: this.credentials.username,
        hasPassword: !!this.credentials.password,
        passwordLength: this.credentials.password?.length || 0,
        hasSecurityKey: !!this.credentials.securityKey,
        securityKeyLength: this.credentials.securityKey?.length || 0,
        gatewayUrl: this.credentials.gatewayUrl,
        isTestMode: this.credentials.isTestMode,
        timestamp: new Date().toISOString()
      });

      // Check for bypass mode
      if (this.credentials.username === 'BYPASS_MODE') {
        console.log('🚀 NMI BYPASS MODE DETECTED - Simulating successful payment');
        
        const mockTransactionId = `bypass_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockAuthCode = `AUTH${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        console.log('✅ NMI BYPASS SUCCESS:', {
          transactionId: mockTransactionId,
          authCode: mockAuthCode,
          amount: paymentData.amount,
          orderId: paymentData.orderId,
          email: paymentData.email,
          timestamp: new Date().toISOString()
        });
        
        return {
          success: true,
          transactionId: mockTransactionId,
          authCode: mockAuthCode,
          message: 'Payment successful (bypass mode)'
        };
      }

      const postData = this.buildPaymentRequest(paymentData);
      
      console.log('💳 NMI Payment Request Details:', {
        url: this.credentials.gatewayUrl,
        isTestMode: this.credentials.isTestMode,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        customerEmail: paymentData.email,
        timestamp: new Date().toISOString()
      });

      console.log('📤 Sending request to NMI Gateway...');
      const response = await fetch(this.credentials.gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postData,
      });

      console.log('📥 NMI Response Status:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });

      const responseText = await response.text();
      console.log('📄 NMI Raw Response:', {
        responseText,
        length: responseText.length,
        timestamp: new Date().toISOString()
      });

      const parsedResponse = this.parseResponse(responseText);
      
      console.log('🔍 NMI Parsed Response:', {
        success: parsedResponse.success,
        transactionId: parsedResponse.transactionId,
        authCode: parsedResponse.authCode,
        message: parsedResponse.message,
        error: parsedResponse.error,
        timestamp: new Date().toISOString()
      });

      return parsedResponse;
    } catch (error) {
      console.error('❌ NMI Payment Processing Error:', {
        error: error.message,
        stack: error.stack,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        timestamp: new Date().toISOString()
      });
      return {
        success: false,
        error: `Payment processing failed: ${error.message}`
      };
    }
  }

  /**
   * Build the payment request data for NMI
   */
  private buildPaymentRequest(paymentData: NmiPaymentRequest): string {
    const params = new URLSearchParams();
    
    // Authentication
    params.append('username', this.credentials.username);
    params.append('password', this.credentials.password);
    
    // Transaction details
    params.append('type', 'sale');
    params.append('amount', paymentData.amount.toFixed(2));
    
    // Payment method
    params.append('ccnumber', paymentData.cardNumber);
    params.append('ccexp', paymentData.expirationDate);
    params.append('cvv', paymentData.cvv);
    
    // Customer information
    params.append('firstname', paymentData.firstName);
    params.append('lastname', paymentData.lastName);
    params.append('email', paymentData.email);
    
    // Order information
    if (paymentData.orderId) {
      params.append('orderid', paymentData.orderId);
    }
    
    const requestBody = params.toString();
    
    // Log request details (without sensitive data)
    console.log('🔧 NMI Request Parameters:', {
      username: this.credentials.username,
      hasPassword: !!this.credentials.password,
      type: 'sale',
      amount: paymentData.amount.toFixed(2),
      cardNumberMasked: paymentData.cardNumber.replace(/\d(?=\d{4})/g, '*'),
      expirationDate: paymentData.expirationDate,
      hasCvv: !!paymentData.cvv,
      firstName: paymentData.firstName,
      lastName: paymentData.lastName,
      email: paymentData.email,
      orderId: paymentData.orderId,
      requestBodyLength: requestBody.length,
      timestamp: new Date().toISOString()
    });
    
    return requestBody;
  }

  /**
   * Parse NMI response
   */
  private parseResponse(responseText: string): NmiPaymentResponse {
    const params = new URLSearchParams(responseText);
    
    const response = params.get('response');
    const responseText2 = params.get('responsetext');
    const transactionId = params.get('transactionid');
    const authCode = params.get('authcode');
    
    if (response === '1') {
      return {
        success: true,
        transactionId: transactionId || undefined,
        authCode: authCode || undefined,
        message: responseText2 || 'Payment successful'
      };
    } else {
      return {
        success: false,
        error: responseText2 || 'Payment failed',
        transactionId: transactionId || undefined
      };
    }
  }

  /**
   * Validate payment token (mock implementation for now)
   */
  static validatePaymentToken(token: string): { valid: boolean; cardData?: any } {
    // In a real implementation, this would decrypt/validate the payment token
    // For now, we'll mock the validation
    if (!token || !token.startsWith('mock_client_secret_')) {
      return { valid: false };
    }

    // Mock card data extraction from token
    return {
      valid: true,
      cardData: {
        cardNumber: '4111111111111111', // Test card
        expirationDate: '1225', // MM/YY format
        cvv: '123',
        firstName: 'Test',
        lastName: 'User'
      }
    };
  }
}

/**
 * Create NMI processor instance from credentials
 */
export function createNmiProcessor(credentials: {
  username: string;
  password: string;
  securityKey: string;
  gatewayUrl?: string;
  isTestMode?: boolean;
}): NmiPaymentProcessor {
  return new NmiPaymentProcessor({
    username: credentials.username,
    password: credentials.password,
    securityKey: credentials.securityKey,
    gatewayUrl: credentials.gatewayUrl || 'https://secure.networkmerchants.com/api/transact.php',
    isTestMode: credentials.isTestMode || false
  });
}