# Product Requirements Document (PRD) - Watchlist
 
## 1. Visão Geral e Objetivo
 
O Watchlist é uma aplicação web para gerenciar filmes e séries. O usuário pode buscar títulos, adicioná-los à sua lista pessoal e organizar o que já assistiu, está assistindo ou ainda quer ver.
 
O diferencial da aplicação é a integração com a **OMDb API**, que permite buscar automaticamente informações reais de filmes e séries (pôster, sinopse, ano, gênero) sem precisar digitar tudo manualmente. Os dados da lista pessoal do usuário são salvos localmente via **JSON Server** e **localStorage**, sem necessidade de login.
 
## 2. Atores do Sistema
 
- **Visitante:** Usuário que acessa a aplicação pela primeira vez e ainda não tem itens na lista.
- **Usuário:** Usuário que utiliza a aplicação para buscar títulos e gerenciar sua lista pessoal de filmes e séries.
- **OMDb API (Sistema externo):** Fornece os dados dos títulos buscados (pôster, sinopse, ano, gênero).
- **JSON Server (Sistema local):** Armazena e fornece os itens salvos na lista pessoal do usuário.

## 3. Histórias de Usuário e Escopo
 
Abaixo estão as funcionalidades principais do MVP, escritas sob a perspectiva do usuário final.
 
### 🔍 Épico 1: Busca de Títulos
 
**US01 - Buscar filme ou série:**
Como um Usuário, quero digitar o nome de um filme ou série para buscar informações via OMDb API e adicioná-lo à minha lista.
 
- Critérios de Aceitação: campo obrigatório; exibir pôster, título, ano e sinopse; exibir mensagem de erro se não encontrado; título já existente na lista gera aviso.
 
### 📋 Épico 2: Gerenciamento da Lista
 
**US02 - Cadastrar título:**
Como um Usuário, quero preencher um formulário para adicionar um título à minha lista com título, tipo, plataforma, status e nota.
 
- Critérios de Aceitação: título e tipo são obrigatórios; dados salvos no JSON Server via POST; formulário valida os campos antes de enviar.
 
**US03 - Visualizar, editar e remover itens:**
Como um Usuário, quero ver minha lista em cards, editar as informações de um item e removê-lo quando quiser.
 
- Critérios de Aceitação: lista carregada via GET; edição salva via PUT; remoção via DELETE com confirmação em modal.
 