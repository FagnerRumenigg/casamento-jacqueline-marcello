import { payload as pixPayload } from 'pix-payload';

import { PIX_CONFIG } from '../config/pix';

export function generatePixPayload({
  amount,
  description,
}: {
  amount?: number;
  description: string;
}): string {
  return pixPayload({
    key: PIX_CONFIG.key,
    name: PIX_CONFIG.name,
    city: PIX_CONFIG.city,
    amount,
    message: description,
  });
}
