# Gerador de Planos de Aula com IA

Sistema para geração automática de planos de aula personalizados, utilizando IA (Google Gemini API) e Supabase como backend. O projeto foi desenvolvido como solução para o Teste Técnico 2 do processo seletivo da Escribo.

---

## 📚 Objetivo

Gerar planos de aula completos e alinhados à BNCC, contendo:
- **Introdução lúdica**: Apresentação criativa do tema.
- **Objetivo de aprendizagem (BNCC)**: Objetivo alinhado à Base Nacional Comum Curricular.
- **Passo a passo da atividade**: Roteiro detalhado para execução.
- **Rubrica de avaliação**: Critérios para avaliação do aprendizado.

---

## 🛠️ Stack Utilizada

- **Frontend:** HTML, CSS, JavaScript puro
- **Backend:** Supabase (PostgreSQL, Auth, Functions)
- **IA:** Google Gemini API (via Google AI Studio)

---

## 📦 Estrutura de Dados

### Tabelas

- **planos_de_aula**
  - `id`: BIGINT, PK
  - `created_at`: TIMESTAMP
  - `tema_aula`: TEXT
  - `ano_escolar`: TEXT
  - `introducao_ludica`: TEXT
  - `objetivo_bncc`: TEXT
  - `passo_a_passo`: TEXT (JSON serializado)
  - `rubrica_avaliacao`: TEXT

- **configs**
  - `id`: INT, PK
  - `key_name`: TEXT (único)
  - `key_value`: TEXT
  - `created_at`: TIMESTAMP

### Scripts SQL

Veja os arquivos em `/supabase/migrations/` para criação das tabelas.

---

## 🧠 Escolha do Modelo Gemini

O modelo escolhido foi **gemini-2.0-flash**, por ser otimizado para geração rápida de textos estruturados e suportar prompts complexos. A escolha foi baseada na documentação oficial do [Google AI Studio](https://aistudio.google.com/), priorizando custo zero e facilidade de integração.

---

## 🚀 Instalação e Setup

### 1. Clone o repositório

```bash
git clone https://github.com/dmardoqueu/gerador-planos-de-aula.git
cd gerador-planos-de-aula
```

### 2. Configurar Supabase

- Crie um projeto no [Supabase](https://supabase.com/)
- Execute os scripts SQL em `/supabase/migrations/` para criar as tabelas.
- Ative Row Level Security conforme indicado.

### 3. Variáveis de Ambiente

Configure as seguintes variáveis no Supabase Functions:

- `GEMINI_API_KEY`: Chave da API Gemini (Google AI Studio)
- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_ANON_KEY`: Chave pública do Supabase

### 4. Executar localmente

- Abra o arquivo `index.html` em seu navegador.
- Para desenvolvimento de funções, utilize o Supabase CLI ou deploy direto pelo painel.

---

## 🖥️ Como funciona

1. O usuário preenche o formulário com tema e ano escolar.
2. O frontend envia os dados para a Supabase Function (`generate-plan`).
3. A função chama a Gemini API com um prompt estruturado.
4. A resposta é processada, validada como JSON e salva no banco.
5. O plano gerado é exibido na tela, com tratamento de erros.

---

## ⚙️ Decisões Técnicas

- **Frontend puro:** Facilita deploy e testes, sem dependências.
- **Gemini 2.0 Flash:** Melhor custo-benefício para geração de textos rápidos e estruturados.
- **Supabase Functions:** Permite integração segura com IA e banco de dados.
- **Armazenamento seguro de chaves:** Tabela `configs` criada para possíveis expansões.

---

## 🧩 Desafios & Soluções

- **Parsing da resposta da IA:** Gemini pode retornar texto misturado; foi implementado regex para extrair apenas o JSON.
- **Validação de inputs:** Feita no frontend e backend para garantir integridade.
- **Tratamento de erros:** Mensagens claras ao usuário e logs detalhados no backend.
- **Segurança:** Uso de RLS e variáveis de ambiente para proteger dados sensíveis.

---

## 📄 Scripts SQL

Veja os arquivos:
- [`20251015025853_create_plans_table.sql`](./supabase/migrations/20251015025853_create_plans_table.sql)
- [`20251015155824_create_configs_table.sql`](./supabase/migrations/20251015155824_create_configs_table.sql)

---



## 📑 Referências

- [Google AI Studio](https://aistudio.google.com/)
- [Supabase Docs](https://supabase.com/docs)


