export interface SMSResult {
  success: boolean;
  message: string;
  provider: 'fast2sms' | 'dev_mock';
}

/**
 * Dispatches real SMS OTP via Fast2SMS API
 * Uses Quick Transactional route (which requires no pre-verification or DLT)
 */
export async function sendSMS(phone: string, otpCode: string): Promise<SMSResult> {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey || apiKey === 'mock_key' || apiKey.trim() === '') {
    console.warn(`[SMS MOCK] No Fast2SMS API key set. Code for +91${phone}: ${otpCode}`);
    return {
      success: true,
      message: 'Simulated SMS dispatch',
      provider: 'dev_mock',
    };
  }

  try {
    const url = 'https://www.fast2sms.com/dev/bulkV2';

    // Route 'q' (Quick SMS) delivers immediately without website verification or DLT registration
    const payload = {
      route: 'q',
      message: `Your Zupit verification code is: ${otpCode}. Valid for 5 minutes. Do not share with anyone.`,
      language: 'english',
      flash: 0,
      numbers: phone,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: any = await response.json();

    if (data.return === true) {
      console.log(`[SMS SUCCESS] Real Fast2SMS delivered to +91${phone}. Request ID:`, data.request_id);
      return {
        success: true,
        message: 'SMS sent successfully',
        provider: 'fast2sms',
      };
    } else {
      console.error(`[SMS ERROR] Fast2SMS rejected request:`, data.message);
      return {
        success: false,
        message: Array.isArray(data.message) ? data.message.join(', ') : data.message || 'SMS delivery failed',
        provider: 'fast2sms',
      };
    }
  } catch (error: any) {
    console.error('[SMS EXCEPTION] Failed to connect to Fast2SMS API:', error.message);
    return {
      success: false,
      message: 'Network error contacting SMS gateway',
      provider: 'fast2sms',
    };
  }
}

