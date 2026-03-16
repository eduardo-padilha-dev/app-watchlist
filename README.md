# 🎬 Watchlist — Gerenciador de Filmes e Séries

## 👤 Identificação / Autor

**Nome:** Eduardo Padilha do Nascimento
**RA:** a2598744
**Curso:**  Sistemas para Internet 
**Disciplina:** Desenvolvimento de Páginas Web com Framework e CSS 
**Professor:** Dr. Roni Fabio Banaszewski

---

## 📋 Descrição do Projeto

O **Watchlist** é uma aplicação web para gerenciar filmes e séries que você deseja assistir, está assistindo ou já concluiu. O usuário pode buscar títulos via API pública (OMDb), adicionar à sua lista pessoal com informações como plataforma de streaming, status e nota, além de gerenciar sua coleção com edição e exclusão de registros.

---

## 🔗 Links

| Recurso                            | Link                     |
| ---------------------------------- | ------------------------ |
| 🎨 Protótipo no Figma              | _[link do Figma]_        |
| 🖌️ Design System                   | _[link do documento]_    |
| 🌐 Site em Produção (GitHub Pages) | _[link do GitHub Pages]_ |

---

## 🛠️ Tecnologias

- **Framework CSS:** Bootstrap 5
- **Dependências JavaScript:**
  - jQuery
  - jQuery Mask Plugin
  - Axios (ou Fetch API nativa)
  - JSON Server (API fake local)
  - OMDb API (API pública)

---

## ✅ Checklist de Funcionalidades

### RA1 — Frameworks CSS e Layouts Responsivos

- [ ] **ID 01** — Protótipo de interfaces mobile e desktop no Figma (ou Stitch)
- [ ] **ID 02** — Layout responsivo com Bootstrap usando Flexbox/Grid do framework
- [ ] **ID 03** — Layout responsivo com CSS puro usando Flexbox ou Grid Layout
- [ ] **ID 04** — Uso de componentes prontos do Bootstrap (cards, buttons, modals, carousel)
- [ ] **ID 05** — Layout fluido com unidades relativas (vw, vh, %, em, rem)
- [ ] **ID 06** — Design System consistente aplicado em toda a aplicação (cores, tipografia, componentes)
- [ ] **ID 07** — Uso de Sass (SCSS) com variáveis, mixins e funções
- [ ] **ID 08** — Tipografia responsiva com media queries mobile-first ou função `clamp()`
- [ ] **ID 09** — Responsividade de imagens com `object-fit` e containers com unidades relativas
- [ ] **ID 10** — Otimização de imagens com formato WebP e carregamento adaptativo (`srcset` ou Cloudinary)

### RA2 — Formulários e Validações

- [ ] **ID 11** — Validação HTML nativa com campos obrigatórios, tipos e mensagens de erro/sucesso
- [ ] **ID 12** — Uso de expressões regulares (REGEX) para validações customizadas
- [ ] **ID 13** — Elementos de seleção em formulários (checkbox, radio, select)
- [ ] **ID 14** — Leitura e escrita no Web Storage (localStorage/sessionStorage)

### RA3 — Ferramentas de Desenvolvimento

- [ ] **ID 15** — Ambiente configurado com Node.js e NPM
- [ ] **ID 16** — Boas práticas de versionamento no Git/GitHub (branches, `.gitignore`)
- [ ] **ID 17** — README.md padronizado conforme template da disciplina com checklist preenchido
- [ ] **ID 18** — Arquivos do projeto organizados de forma modular
- [ ] **ID 19** — Linters e formatadores configurados (ESLint, Prettier)

### RA4 — Bibliotecas JavaScript

- [ ] **ID 20** — jQuery para manipulação do DOM e interatividade (eventos, animações)
- [ ] **ID 21** — Plugin jQuery integrado e configurado (ex: jQuery Mask Plugin)

### RA5 — Requisições Assíncronas

- [ ] **ID 22** — Requisições assíncronas para API fake (JSON Server) para persistir dados do formulário
- [ ] **ID 23** — Requisições assíncronas para API fake (JSON Server) para exibir dados na página
- [ ] **ID 24** — Requisições assíncronas para API pública real (OMDb API), exibindo dados e tratando erros

---

## 📄 Páginas da Aplicação

| Página             | Descrição                                                      |
| ------------------ | -------------------------------------------------------------- |
| `index.html`       | Home — busca de filmes e séries via OMDb API                   |
| `minha-lista.html` | Listagem dos títulos cadastrados com filtros por status e tipo |
| `cadastro.html`    | Formulário de cadastro e edição de títulos na lista            |

---

## 📦 Estrutura do Projeto

```
watchlist/
├── index.html
├── minha-lista.html
├── cadastro.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── style.scss
│   ├── js/
│   │   ├── main.js
│   │   ├── api.js
│   │   └── storage.js
│   └── img/
├── db.json              ← JSON Server (API fake)
├── package.json
├── .gitignore
└── README.md
```

---

## ▶️ Instruções de Execução

### Pré-requisitos

- Node.js instalado ([nodejs.org](https://nodejs.org))
- NPM (incluso com Node.js)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/eduardo-padilha-dev/app-watchlist.git
cd app-watchlist

# 2. Instale as dependências
npm install

# 3. Inicie o JSON Server (API fake)
npx json-server --watch db.json --port 3000

# 4. Abra o index.html no navegador
# (ou use a extensão Live Server no VS Code)
```

> **Nota:** O site em produção (GitHub Pages) utiliza apenas CDN para as dependências e a OMDb API. O JSON Server é necessário apenas para execução local.

---

## 🖼️ Telas da Aplicação

| Home         | Minha Lista  | Cadastro     |
| ------------ | ------------ | ------------ |
| _screenshot_ | _screenshot_ | _screenshot_ |
