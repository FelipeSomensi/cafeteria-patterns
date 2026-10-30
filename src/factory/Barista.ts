import { Bebida, TipoBebida } from "../types";
import { Espresso, Cappuccino, Cha } from "./produtos";

/** Creator: declara o Factory Method e tem a regra de negócio. */
export abstract class Barista {
  // Factory Method: cada subclasse decide qual bebida criar
  protected abstract criarBebida(): Bebida;

  // Lógica de negócio que usa o produto sem saber o tipo concreto
  public preparar(): Bebida {
    const bebida = this.criarBebida();
    console.log(`[Barista] Preparando: ${bebida.getDescricao()}`);
    return bebida;
  }
}

// Concrete Creators
export class BaristaEspresso extends Barista {
  protected criarBebida(): Bebida {
    return new Espresso();
  }
}

export class BaristaCappuccino extends Barista {
  protected criarBebida(): Bebida {
    return new Cappuccino();
  }
}

export class BaristaCha extends Barista {
  protected criarBebida(): Bebida {
    return new Cha();
  }
}

/** Escolhe o criador pelo enum. O Record obriga a cobrir todos os tipos. */
const BARISTAS: Record<TipoBebida, () => Barista> = {
  [TipoBebida.ESPRESSO]: () => new BaristaEspresso(),
  [TipoBebida.CAPPUCCINO]: () => new BaristaCappuccino(),
  [TipoBebida.CHA]: () => new BaristaCha(),
};

export function obterBarista(tipo: TipoBebida): Barista {
  return BARISTAS[tipo]();
}