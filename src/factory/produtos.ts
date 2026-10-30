import { Bebida, TipoBebida, PRECO_BASE } from "../types";

/** Classe abstrata: reaproveita nome e preço para todas as bebidas base. */
export abstract class BebidaBase implements Bebida {
  protected constructor(
    private readonly nome: string,
    private readonly tipo: TipoBebida
  ) {}

  getDescricao(): string {
    return this.nome;
  }

  getPreco(): number {
    return PRECO_BASE[this.tipo];
  }
}

// Produtos concretos
export class Espresso extends BebidaBase {
  constructor() {
    super("Espresso", TipoBebida.ESPRESSO);
  }
}

export class Cappuccino extends BebidaBase {
  constructor() {
    super("Cappuccino", TipoBebida.CAPPUCCINO);
  }
}

export class Cha extends BebidaBase {
  constructor() {
    super("Chá", TipoBebida.CHA);
  }
}