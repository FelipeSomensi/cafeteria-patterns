import { Bebida, ItemPedido } from "../types";
import { Pedido } from "../builder/Pedido";
import { Comando } from "./Comando";

/** Adiciona uma bebida ao pedido; desfazer remove o mesmo item. */
export class AdicionarItemCommand implements Comando {
  readonly descricao: string;
  private itemAdicionado: ItemPedido | null = null;

  constructor(
    private readonly pedido: Pedido,
    private readonly bebida: Bebida
  ) {
    this.descricao = `Adicionar ${bebida.getDescricao()}`;
  }

  execute(): void {
    this.itemAdicionado = this.pedido.adicionarItem(this.bebida);
  }

  undo(): void {
    if (this.itemAdicionado) {
      this.pedido.removerItem(this.itemAdicionado.id);
      this.itemAdicionado = null;
    }
  }
}

/** Remove um item do pedido; desfazer o coloca de volta. */
export class RemoverItemCommand implements Comando {
  readonly descricao: string;
  private itemRemovido: ItemPedido | null = null;

  constructor(
    private readonly pedido: Pedido,
    private readonly idItem: number
  ) {
    this.descricao = `Remover item ${idItem}`;
  }

  execute(): void {
    this.itemRemovido =
      this.pedido.itens.find((item) => item.id === this.idItem) ?? null;
    this.pedido.removerItem(this.idItem);
  }

   undo(): void {
    if (this.itemRemovido) {
      this.pedido.restaurarItem(this.itemRemovido);
      this.itemRemovido = null;
    }
  }
}