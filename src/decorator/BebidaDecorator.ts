import { Bebida } from "../types";

/** BaseDecorator: implementa Bebida e guarda uma Bebida (composição). */
export abstract class BebidaDecorator implements Bebida {
  constructor(protected readonly bebidaEnvolvida: Bebida) {}

  getDescricao(): string {
    return this.bebidaEnvolvida.getDescricao();
  }

  getPreco(): number {
    return this.bebidaEnvolvida.getPreco();
  }
}