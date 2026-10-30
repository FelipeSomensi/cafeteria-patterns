import { BebidaDecorator } from "./BebidaDecorator";

export class LeiteDecorator extends BebidaDecorator {
  getDescricao(): string {
    return `${this.bebidaEnvolvida.getDescricao()} + Leite`;
  }
  getPreco(): number {
    return this.bebidaEnvolvida.getPreco() + 2.0;
  }
}

export class ChantillyDecorator extends BebidaDecorator {
  getDescricao(): string {
    return `${this.bebidaEnvolvida.getDescricao()} + Chantilly`;
  }
  getPreco(): number {
    return this.bebidaEnvolvida.getPreco() + 3.5;
  }
}

export class CarameloDecorator extends BebidaDecorator {
  getDescricao(): string {
    return `${this.bebidaEnvolvida.getDescricao()} + Caramelo`;
  }
  getPreco(): number {
    return this.bebidaEnvolvida.getPreco() + 2.5;
  }
}