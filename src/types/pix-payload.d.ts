declare module 'pix-payload' {
  export interface PixOptions {
    key: string;
    name: string;
    city: string;
    amount?: number;
    message?: string;
  }

  export class Pix {
    constructor(options: PixOptions);
    getPayload(): string;
  }
}
