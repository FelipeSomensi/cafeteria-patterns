import { DadosPedido } from "../types";
import { Pedido } from "./Pedido";

/** Builder com interface fluente: cada método retorna `this`. */
export class PedidoBuilder {
  // Partial: começa vazio e vai sendo preenchido aos poucos
  private dados: Partial<DadosPedido> = {};

  // Parâmetro obrigatório vem no construtor
  constructor(cliente: string) {
    this.dados.cliente = cliente;
  }

  public comObservacao(observacao: string): this {
    this.dados.observacao = observacao;
    return this;
  }

  public paraEntrega(endereco: string): this {
    this.dados.entrega = true;
    this.dados.enderecoEntrega = endereco;
    return this;
  }

  public build(): Pedido {
    const { cliente } = this.dados;

    // Validação de consistência (o PDF sugere fazer isso no build)
    if (!cliente || cliente.trim() === "") {
      throw new Error("O pedido precisa de um nome de cliente.");
    }
    if (this.dados.entrega && !this.dados.enderecoEntrega?.trim()) {
      throw new Error("Pedido para entrega precisa de endereço.");
    }

    // Valores padrão para os campos opcionais não informados
    return new Pedido({
      cliente,
      observacao: this.dados.observacao ?? "",
      entrega: this.dados.entrega ?? false,
      enderecoEntrega: this.dados.enderecoEntrega ?? "",
    });
  }
}