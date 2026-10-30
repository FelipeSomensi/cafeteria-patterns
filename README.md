# Cafeteria Patterns

Simulador de pedidos de uma cafeteria (CLI) em TypeScript, desenvolvido para
demonstrar a aplicação consciente de **6 Padrões de Projeto (GoF)**.

## Descrição do Projeto

O sistema resolve o problema de gerenciar pedidos em uma cafeteria: montar um
pedido com dados opcionais, preparar bebidas personalizáveis com extras,
adicionar e desfazer itens, calcular o valor final conforme a forma de
pagamento e notificar cozinha e cliente a cada mudança de status.

Cada decisão de design foi tomada para evitar problemas clássicos do material
da disciplina: construtores com muitos parâmetros, `if/else` extensos,
explosão de subclasses e acoplamento forte entre classes.

## Instruções de Execução

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm start
```

Outros comandos:

```bash
npm run build        # compila para a pasta dist/
npm run start:build  # executa a versão compilada
npx tsc --noEmit     # apenas verifica os tipos
```

A execução imprime uma demonstração em 6 seções, uma para cada etapa do fluxo
(`src/main.ts`).

## Estrutura de Pastas

```
src/
├── types/       # enums, interfaces e tipos compartilhados
├── factory/     # Factory Method
├── builder/     # Builder (e o Pedido)
├── decorator/   # Decorator
├── strategy/    # Strategy
├── observer/    # Observer
├── command/     # Command
└── main.ts      # demonstração integrada
```

## Mapeamento dos Padrões

### 1. Factory Method (Criacional)

**Onde foi aplicado:** `src/factory/Barista.ts` (Creator `Barista` e Concrete
Creators `BaristaEspresso`, `BaristaCappuccino`, `BaristaCha`) e
`src/factory/produtos.ts` (produtos `Espresso`, `Cappuccino`, `Cha`).

**Justificativa:** o sistema precisa criar diferentes bebidas base sem que o
código cliente dependa das classes concretas. Com o Factory Method, cada
subclasse de `Barista` decide qual bebida instanciar, e novos tipos podem ser
adicionados criando uma nova subclasse, sem alterar o código existente
(Open/Closed). O mapa `Record<TipoBebida, ...>` faz o compilador exigir que
todo tipo do enum tenha um criador.

### 2. Builder (Criacional)

**Onde foi aplicado:** `src/builder/PedidoBuilder.ts` (Builder) e
`src/builder/Pedido.ts` (Product).

**Justificativa:** o `Pedido` tem campos opcionais (observação, entrega,
endereço). Sem o Builder seria necessário um construtor telescópico com
`null` e `false` espalhados. A interface fluente deixa a criação legível, e o
método `build()` concentra as validações (cliente obrigatório; entrega exige
endereço), garantindo que nenhum pedido inconsistente seja criado.

### 3. Decorator (Estrutural)

**Onde foi aplicado:** `src/decorator/BebidaDecorator.ts` (BaseDecorator) e
`src/decorator/extras.ts` (`LeiteDecorator`, `ChantillyDecorator`,
`CarameloDecorator`).

**Justificativa:** as bebidas aceitam combinações livres de extras. Usar
herança exigiria uma subclasse para cada combinação (explosão de classes).
Com o Decorator, cada extra é uma classe pequena que envolve a bebida e soma
sua descrição e preço, e as combinações são montadas em tempo de execução por
composição.

### 4. Strategy (Comportamental)

**Onde foi aplicado:** `src/strategy/EstrategiaPagamento.ts` (interface),
`src/strategy/estrategias.ts` (`PagamentoPix`, `PagamentoCartao`,
`PagamentoCupom`) e `src/strategy/Caixa.ts` (Context).

**Justificativa:** cada forma de pagamento tem uma regra de cálculo diferente
(desconto, taxa, cupom). Em vez de um `if/else` na classe `Caixa`, cada regra
é uma estratégia intercambiável, o que eleva a coesão e respeita o Open/Closed:
uma nova forma de pagamento é uma nova classe. A estratégia pode ser trocada
em tempo de execução com `setEstrategia`.

### 5. Observer (Comportamental)

**Onde foi aplicado:** `src/observer/Observador.ts` (interface e tipo
`EventoPedido`), `src/observer/observadores.ts` (`PainelCozinha`,
`NotificacaoCliente`, `RegistroLog`) e `src/builder/Pedido.ts` (Subject, com
`inscrever`, `desinscrever` e `mudarStatus`).

**Justificativa:** cozinha, cliente e log precisam reagir às mudanças de
status do pedido, e o pedido não deve conhecer cada um deles. O Observer
mantém o acoplamento fraco: o `Pedido` só conhece a interface
`ObservadorPedido`. Observers podem entrar e sair em tempo de execução, e o
método `desinscrever` evita vazamento de memória.

### 6. Command (Comportamental)

**Onde foi aplicado:** `src/command/Comando.ts` (interface),
`src/command/comandos.ts` (`AdicionarItemCommand`, `RemoverItemCommand`),
`src/command/Atendente.ts` (Invoker) e `src/command/Historico.ts` (pilha
genérica).

**Justificativa:** adicionar e remover itens são ações que precisam ser
desfeitas. Ao transformar cada ação em um objeto com `execute()` e `undo()`, o
`Atendente` mantém um histórico e desfaz as operações em ordem inversa, sem
conhecer a lógica de cada uma. Durante o desenvolvimento, um bug de
identidade de itens no undo da remoção mostrou que cada comando precisa
guardar estado suficiente para reverter a ação com fidelidade; foi corrigido
com o método `Pedido.restaurarItem`.

## Recursos de TypeScript Utilizados

| Recurso | Onde |
|---------|------|
| `enum` | `TipoBebida`, `StatusPedido` (`src/types`) |
| Union types | `FormaPagamento` (`src/types`) |
| Interfaces | `Bebida`, `Comando`, `EstrategiaPagamento`, `ObservadorPedido` |
| Classes abstratas | `Barista`, `BebidaBase`, `BebidaDecorator` |
| Genéricos | `Historico<T>` (`src/command/Historico.ts`) |
| Tipos utilitários | `Record`, `Partial`, `Readonly` |
| `readonly` e `as const` | `ItemPedido`, `forma` nas estratégias |
| Parameter properties | construtores de `Caixa`, `BebidaDecorator`, comandos |
| Modo `strict` | `tsconfig.json` |

## Observação de Design

Os padrões cooperam em um mesmo fluxo: o **Factory Method** cria a bebida, o
**Decorator** a personaliza, o **Command** a adiciona ao **Pedido**
(criado pelo **Builder**), o **Strategy** calcula o pagamento e o **Observer**
notifica as mudanças de status.