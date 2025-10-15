-- Migração para criar uma tabela segura para configs e chaves de API.

CREATE TABLE public.configs (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  key_name TEXT UNIQUE NOT NULL,
  key_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.configs IS 'Tabela segura para armazenar chaves de API e outras configurações sensíveis.';

-- Habilita a Segurança de Nível de Linha para garantir que a tabela seja privada por padrão.
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;