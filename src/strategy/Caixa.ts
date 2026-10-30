import { ResultadoPagamento } from "../types";
import { EstrategiaPagamento } from "./EstrategiaPagamento";

/** Context: usa a estratégia sem saber qual é a classe concreta. */
export class Caixa {
  constructor(private estrategia: EstrategiaPagamento) {}

  // Permite trocar a estratégia em tempo de execução
  public setEstrategia(estrategia: EstrategiaPagamento): void {
    this.estrategia = estrategia;
  }

  public processar(valor: number): ResultadoPagamento {
    const valorFinal = this.estrategia.calcularValorFinal(valor);
    return {
      forma: this.estrategia.forma,
      valorOriginal: valor,
      valorFinal,
      descricao: this.estrategia.descrever(valor, valorFinal),
    };
  }
}