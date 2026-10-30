import { FormaPagamento } from "../types";

/** Strategy: contrato comum a todas as formas de pagamento. */
export interface EstrategiaPagamento {
  readonly forma: FormaPagamento;
  calcularValorFinal(valor: number): number;
  descrever(valorOriginal: number, valorFinal: number): string;
}