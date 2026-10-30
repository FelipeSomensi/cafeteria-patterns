import { EstrategiaPagamento } from "./EstrategiaPagamento";

export class PagamentoPix implements EstrategiaPagamento {
  readonly forma = "PIX" as const;

  calcularValorFinal(valor: number): number {
    return valor * 0.95; // 5% de desconto
  }

  descrever(valorOriginal: number, valorFinal: number): string {
    return `PIX: desconto de R$ ${(valorOriginal - valorFinal).toFixed(2)} (5%)`;
  }
}

export class PagamentoCartao implements EstrategiaPagamento {
  readonly forma = "CARTAO" as const;

  calcularValorFinal(valor: number): number {
    return valor * 1.02; // taxa de 2%
  }

  descrever(valorOriginal: number, valorFinal: number): string {
    return `Cartão: taxa de R$ ${(valorFinal - valorOriginal).toFixed(2)} (2%)`;
  }
}

export class PagamentoCupom implements EstrategiaPagamento {
  readonly forma = "CUPOM" as const;

  constructor(private readonly desconto: number) {}

  calcularValorFinal(valor: number): number {
    return Math.max(0, valor - this.desconto); // nunca fica negativo
  }

  descrever(valorOriginal: number, valorFinal: number): string {
    return `Cupom: desconto de R$ ${(valorOriginal - valorFinal).toFixed(2)}`;
  }
}