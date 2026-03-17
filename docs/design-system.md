# Design System - Watchlist

Neste projeto, utilizamos o Bootstrap 5 como framework CSS e aplicamos customizações para refletir a identidade visual da aplicação.

## 1. Framework Base

- **Framework escolhido:** Bootstrap 5
- **Motivação:** Oferece um sistema de grid responsivo e componentes prontos como cards, modais e carrosséis, agilizando o desenvolvimento e garantindo compatibilidade com diferentes tamanhos de tela.

## 2. Paleta de Cores

As cores foram escolhidas para remeter à estética de cinema, com fundo escuro e destaque em âmbar.

- **Cor Primária (Âmbar):** `#E8B44B`
  - Uso: Botões de ação principal, ícones ativos e destaques. Remete à luz de projetores de cinema.
- **Cor de Fundo:** `#0C0E13`
  - Uso: Fundo de todas as páginas. Cria a sensação de sala escura.
- **Cor de Superfície:** `#13161F`
  - Uso: Fundo de cards, navbar e painéis.
- **Cor de Sucesso:** `#4CAF82`
  - Uso: Status "Concluído" e mensagens de validação positiva.
- **Cor de Erro:** `#E85B5B`
  - Uso: Mensagens de erro em formulários e botão de excluir.
- **Cor de Info:** `#5B8DEE`
  - Uso: Status "Quero Ver".
- **Cor Neutra:** `#7A8099`
  - Uso: Textos secundários e status "Abandonado".

### Cores de status dos itens

Cada status da lista tem uma cor para facilitar a identificação visual:

| Status | Cor |
|--------|-----|
| Assistindo | `#E8B44B` (âmbar) |
| Concluído | `#4CAF82` (verde) |
| Quero Ver | `#5B8DEE` (azul) |
| Abandonado | `#7A8099` (cinza) |

## 3. Tipografia

Importada via Google Fonts para dar uma identidade visual mais marcante:

- **Títulos (H1, H2, nome do app):** `Bebas Neue, sans-serif` — fonte condensada e impactante, muito usada em cartazes de filmes.
- **Textos corridos, botões e inputs:** `Outfit, sans-serif` (Peso: 400 e 600) — fonte moderna e de fácil leitura.
- **Labels de formulário e dados como ano e duração:** `JetBrains Mono, monospace` — destaca informações técnicas do restante do texto.

## 4. Diretrizes de Uso de Componentes

Regras para aplicação dos componentes do Bootstrap na aplicação:

- **Botões (`.btn`):** Ações principais como "Adicionar" e "Salvar" usam `.btn-primary` com a cor âmbar. Ações de cancelar usam `.btn-outline-secondary` para não chamar atenção. Ações de excluir usam `.btn-outline-danger`.
- **Cards (`.card`):** Usados para exibir os filmes e séries da lista, com poster, título, ano e badge de status. No hover, aplicar uma leve sombra para indicar interatividade.
- **Formulários (`.form-control`):** Os labels ficam em letras maiúsculas com a fonte mono. Campos com erro mostram borda vermelha e mensagem abaixo. Campos válidos mostram borda verde.
- **Modal (`.modal`):** Usado para confirmar exclusão de um item da lista. O botão de cancelar fica à esquerda e o de confirmar à direita.
- **Toast (`.toast`):** Aparece no canto inferior direito após ações como salvar ou excluir um item. Some automaticamente após 3 segundos.