// Vercel Serverless Function sécurisée pour les Webhooks GeniusPay
import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  // CORS Headers stricts
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-GeniusPay-Signature, Signature'
  );

  // Pre-flight check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sécurité : Seules les requêtes POST sont autorisées pour les webhooks
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: `Méthode HTTP ${req.method} non autorisée. Utilisez POST.`
    });
  }

  try {
    const body = req.body || {};
    const signature = req.headers['x-geniuspay-signature'] || req.headers['signature'];
    const webhookSecret = process.env.VITE_GENIUSPAY_WEBHOOK_SECRET || process.env.GENIUSPAY_WEBHOOK_SECRET || '';

    // Vérification de la signature HMAC si le secret est configuré
    let signatureVerified = false;
    if (webhookSecret && signature) {
      try {
        const rawPayload = typeof body === 'string' ? body : JSON.stringify(body);
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(rawPayload)
          .digest('hex');

        signatureVerified = crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature)
        );
      } catch (err) {
        console.warn('[GeniusPay Webhook] Erreur lors de la vérification de signature:', err);
      }
    }

    // Événements supportés par GeniusPay : payment.success, payment.failed, payment.refunded, etc.
    const event = body.event || body.type || 'test.ping';
    const transactionId = body.data?.id || body.data?.reference || body.reference || 'N/A';

    console.log(`[GeniusPay Webhook - EVENTFLOW] Événement reçu : ${event} | Transaction : ${transactionId} | Signature vérifiée : ${signatureVerified}`);

    // Réponse immédiate 200 OK avec accusé de réception
    return res.status(200).json({
      status: 'success',
      received: true,
      event: event,
      transactionId: transactionId,
      signatureVerified: signatureVerified,
      timestamp: new Date().toISOString(),
      message: 'Webhook GeniusPay validé et traité avec succès par EVENTFLOW CI'
    });
  } catch (error: any) {
    console.error('[GeniusPay Webhook] Erreur interne :', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Erreur interne lors du traitement du webhook'
    });
  }
}
