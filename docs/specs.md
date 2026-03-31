# Especificação Técnica (Tech Spec) - Watchlist

Este documento detalha a arquitetura técnica, o modelo de dados e os contratos de API (via JSON Server) necessários para o funcionamento da aplicação Watchlist.

## 0. Versões das Tecnologias

| Tecnologia | Versão | Observação |
|------------|--------|------------|
| Bootstrap | v5.3.3 | Via CDN |
| jQuery | v3.7.1 | Via CDN |
| jQuery Mask Plugin | v1.14.16 | Via CDN |
| JSON Server | v0.17.4 | Instalado via NPM |
| OMDb API | v1 | Chave gratuita em omdbapi.com |

## 1. Modelo de Dados (Diagrama ER)

A aplicação possui duas entidades principais: **itens** (os filmes e séries salvos pelo usuário) e **generos** (lista de gêneros disponíveis para seleção no formulário).

```mermaid
erDiagram
  ITENS ||--o{ GENEROS : references
  ITENS {
    string id PK
    string titulo
    string tipo
    string genero FK
    string plataforma
    string status
    number nota
    string comentario
    string poster
    string ano
    string dataCadastro
  }
  GENEROS {
    string id PK
    string nome
  }
```

## 2. Dicionário de Dados

### itens
Armazena os filmes e séries salvos pelo usuário na lista pessoal.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | sim | Identificador único gerado pelo JSON Server |
| `titulo` | string | sim | Nome do filme ou série |
| `tipo` | string | sim | Aceita apenas `"filme"` ou `"serie"` |
| `genero` | string | não | Gênero do título (ex: `"Ação"`, `"Drama"`) |
| `plataforma` | string | não | Onde assistir (ex: `"Netflix"`, `"Prime Video"`) |
| `status` | string | sim | Aceita apenas `"quero-ver"`, `"assistindo"`, `"concluido"` ou `"abandonado"` |
| `nota` | number | não | Avaliação pessoal de 1 a 5. Nulo enquanto não assistido |
| `comentario` | string | não | Comentário pessoal do usuário sobre o título |
| `poster` | string | não | URL do pôster retornado pela OMDb API |
| `ano` | string | não | Ano de lançamento retornado pela OMDb API |
| `dataCadastro` | string | sim | Data em que o item foi adicionado à lista (formato `YYYY-MM-DD`) |

### generos
Lista fixa de gêneros disponíveis para seleção no formulário de cadastro.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único |
| `nome` | string | Nome do gênero exibido no select (ex: `"Ação"`, `"Comédia"`) |

## 3. Rotas da API (JSON Server)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/itens` | Retorna todos os itens da lista |
| `GET` | `/itens?status=assistindo` | Retorna itens filtrados por status |
| `GET` | `/itens?tipo=filme` | Retorna itens filtrados por tipo |
| `GET` | `/itens/:id` | Retorna um item específico |
| `POST` | `/itens` | Adiciona um novo item à lista |
| `PUT` | `/itens/:id` | Atualiza todos os dados de um item |
| `DELETE` | `/itens/:id` | Remove um item da lista |
| `GET` | `/generos` | Retorna a lista de gêneros disponíveis |

## 4. Estrutura do Banco de Dados (db.json)

Esta é a estrutura inicial do banco de dados simulado pelo JSON Server.

```json
{
  "itens": [
    {
      "id": "1",
      "titulo": "Interestelar",
      "tipo": "filme",
      "genero": "Ficção Científica",
      "plataforma": "Prime Video",
      "status": "concluido",
      "nota": 5,
      "comentario": "Um dos melhores filmes que já assisti.",
      "poster": "https://poster.jpg",
      "ano": "2014",
      "dataCadastro": "2026-03-17"
    },
    {
      "id": "2",
      "titulo": "Breaking Bad",
      "tipo": "serie",
      "genero": "Drama",
      "plataforma": "Netflix",
      "status": "assistindo",
      "nota": null,
      "comentario": "",
      "poster": "https://poster.jpg",
      "ano": "2008",
      "dataCadastro": "2026-03-17"
    },
    {
      "id": "3",
      "titulo": "Duna: Parte 2",
      "tipo": "filme",
      "genero": "Ficção Científica",
      "plataforma": "Max",
      "status": "quero-ver",
      "nota": null,
      "comentario": "",
      "poster": "https://poster.jpg",
      "ano": "2024",
      "dataCadastro": "2026-03-17"
    }
  ],
  "generos": [
    { "id": "1", "nome": "Ação" },
    { "id": "2", "nome": "Comédia" },
    { "id": "3", "nome": "Drama" },
    { "id": "4", "nome": "Ficção Científica" },
    { "id": "5", "nome": "Terror" },
    { "id": "6", "nome": "Animação" },
    { "id": "7", "nome": "Documentário" },
    { "id": "8", "nome": "Romance" }
  ]
}
```