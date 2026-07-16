-- PrimeClub - schema inicial (MVP)

create type plano_usuario as enum ('trial', 'basico', 'premium');
create type status_assinatura as enum ('ativa', 'atrasada', 'cancelada', 'expirada');
create type status_oferta as enum ('pendente', 'aprovada', 'rejeitada', 'encerrada');
create type status_cupom as enum ('gerado', 'validado', 'expirado');
create type papel_usuario as enum ('consumidor', 'empresa', 'admin');

create table usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  email text not null unique,
  cpf text not null unique,
  telefone text,
  papel papel_usuario not null default 'consumidor',
  plano plano_usuario not null default 'trial',
  status_assinatura status_assinatura not null default 'ativa',
  trial_usado boolean not null default false,
  criado_em timestamptz not null default now()
);

create table empresas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios (id) on delete set null, -- login do painel da empresa
  nome text not null,
  cnpj text not null unique,
  categoria text not null,
  endereco text,
  latitude double precision,
  longitude double precision,
  contrato_assinado boolean not null default false,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table ofertas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas (id) on delete cascade,
  descricao text not null,
  percentual_desconto numeric(5, 2) not null check (percentual_desconto > 0 and percentual_desconto <= 100),
  status status_oferta not null default 'pendente',
  criada_em timestamptz not null default now(),
  moderada_em timestamptz,
  moderada_por uuid references usuarios (id)
);

create table cupons (
  id uuid primary key default gen_random_uuid(),
  oferta_id uuid not null references ofertas (id) on delete cascade,
  usuario_id uuid not null references usuarios (id) on delete cascade,
  codigo text not null unique, -- fallback numérico/alfanumérico
  qr_payload text not null unique,
  status status_cupom not null default 'gerado',
  gerado_em timestamptz not null default now(),
  expira_em timestamptz not null,
  validado_em timestamptz
);

create table avaliacoes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas (id) on delete cascade,
  usuario_id uuid not null references usuarios (id) on delete cascade,
  nota smallint not null check (nota between 1 and 5),
  comentario text,
  criada_em timestamptz not null default now(),
  unique (empresa_id, usuario_id)
);

create table favoritos (
  usuario_id uuid not null references usuarios (id) on delete cascade,
  empresa_id uuid not null references empresas (id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (usuario_id, empresa_id)
);

-- Row Level Security
alter table usuarios enable row level security;
alter table empresas enable row level security;
alter table ofertas enable row level security;
alter table cupons enable row level security;
alter table avaliacoes enable row level security;
alter table favoritos enable row level security;

create function auth_papel() returns papel_usuario
language sql stable
as $$
  select papel from usuarios where id = auth.uid();
$$;

-- usuarios: cada um vê/edita só o próprio registro; admin vê tudo
create policy "usuarios_select_own_or_admin" on usuarios
  for select using (id = auth.uid() or auth_papel() = 'admin');
create policy "usuarios_update_own" on usuarios
  for update using (id = auth.uid());

-- empresas: leitura pública (catálogo); escrita só pelo dono da empresa ou admin
create policy "empresas_select_all" on empresas
  for select using (true);
create policy "empresas_update_own_or_admin" on empresas
  for update using (usuario_id = auth.uid() or auth_papel() = 'admin');
create policy "empresas_insert_admin" on empresas
  for insert with check (auth_papel() = 'admin');

-- ofertas: leitura pública das aprovadas; empresa gerencia as próprias; admin modera todas
create policy "ofertas_select_aprovadas_or_owner_or_admin" on ofertas
  for select using (
    status = 'aprovada'
    or auth_papel() = 'admin'
    or empresa_id in (select id from empresas where usuario_id = auth.uid())
  );
create policy "ofertas_insert_owner" on ofertas
  for insert with check (empresa_id in (select id from empresas where usuario_id = auth.uid()));
create policy "ofertas_update_owner_or_admin" on ofertas
  for update using (
    auth_papel() = 'admin'
    or empresa_id in (select id from empresas where usuario_id = auth.uid())
  );

-- cupons: usuário vê os próprios; empresa vê os da própria oferta; admin vê tudo
create policy "cupons_select_own_or_empresa_or_admin" on cupons
  for select using (
    usuario_id = auth.uid()
    or auth_papel() = 'admin'
    or oferta_id in (
      select o.id from ofertas o
      join empresas e on e.id = o.empresa_id
      where e.usuario_id = auth.uid()
    )
  );
create policy "cupons_insert_own" on cupons
  for insert with check (usuario_id = auth.uid());
create policy "cupons_update_empresa_or_admin" on cupons
  for update using (
    auth_papel() = 'admin'
    or oferta_id in (
      select o.id from ofertas o
      join empresas e on e.id = o.empresa_id
      where e.usuario_id = auth.uid()
    )
  );

-- avaliacoes: leitura pública; escrita só pelo próprio usuário
create policy "avaliacoes_select_all" on avaliacoes
  for select using (true);
create policy "avaliacoes_insert_own" on avaliacoes
  for insert with check (usuario_id = auth.uid());

-- favoritos: só o próprio usuário
create policy "favoritos_own" on favoritos
  for all using (usuario_id = auth.uid());
