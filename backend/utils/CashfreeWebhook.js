import crypto from 'crypto';

const verifyWebhookSignature = (rawBody, signature) => {
  try {
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!secretKey) {
      console.error('CASHFREE_SECRET_KEY is not set');
      return false;
    }
    if (!rawBody || !signature) {
      console.error('Missing rawBody or signature:', { rawBody: !!rawBody, signature: !!signature });
      return false;
    }
    const computedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('base64');
    const isValid = computedSignature === signature;
    console.log('Webhook signature verification:', {
      rawBodyLength: rawBody.length,
      computedSignature,
      receivedSignature: signature,
      isValid,
    });
    if (!isValid) {
      console.error('Signature mismatch:', { computedSignature, receivedSignature: signature });
    }
    return isValid;
  } catch (error) {
    console.error('Error verifying webhook signature:', error.message, error.stack);
    return false;
  }
};

export { verifyWebhookSignature };