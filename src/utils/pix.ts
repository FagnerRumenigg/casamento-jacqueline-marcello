import { PIX_CONFIG } from '../config/pix';

function pad(value: number | string): string {
  return String(value).padStart(2, '0');
}

function evm(id: number | string, subject: string): string {
  if (subject.length > 99) {
    throw new Error('Conteúdo do campo Pix excede o limite permitido.');
  }

  return `${pad(id)}${pad(subject.length)}${subject}`;
}

function crc16(subject: string): string {
  let result = 0xffff;

  for (let offset = 0; offset < subject.length; offset += 1) {
    result ^= subject.charCodeAt(offset) << 8;

    for (let bitwise = 0; bitwise < 8; bitwise += 1) {
      if ((result <<= 1) & 0x10000) {
        result ^= 0x1021;
      }

      result &= 0xffff;
    }
  }

  return result.toString(16).toUpperCase().padStart(4, '0');
}

function buildAmountField(amount?: number): string {
  if (amount === undefined) return '';

  return evm('54', Number(amount).toFixed(2));
}

export async function generatePixPayload({
  amount,
}: {
  amount?: number;
}): Promise<string> {
  const merchantAccountInformation = evm(
    '26',
    `${evm('00', 'BR.GOV.BCB.PIX')}${evm('01', PIX_CONFIG.key)}`,
  );

  const payload =
    evm('00', '01') +
    merchantAccountInformation +
    evm('52', '0000') +
    evm('53', '986') +
    buildAmountField(amount) +
    evm('58', 'BR') +
    evm('59', PIX_CONFIG.name) +
    evm('60', PIX_CONFIG.city);

  return `${payload}${evm('63', crc16(`${payload}6304`))}`;
}
