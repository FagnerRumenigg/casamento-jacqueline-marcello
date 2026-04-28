// Função para importar dinamicamente o payload

async function getPayloadFn() {
  const mod = await import('pix-payload');
  // O pacote exporta como default um objeto com payload
  const pkg = (mod.default || mod) as any;
  return pkg.payload;
}
import { PIX_CONFIG } from '../config/pix';

export async function generatePixPayload({
  amount,
}: {
  amount?: number;
}): Promise<string> {
  const payload = await getPayloadFn();
  return payload({
    key: PIX_CONFIG.key,
    name: PIX_CONFIG.name,
    city: PIX_CONFIG.city,
    amount,
    // message não é suportado diretamente, então remova ou ajuste conforme necessário
  });
}
