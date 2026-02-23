-- 사주 결과 저장 테이블
create table if not exists public.saju_readings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  birth_date date not null,
  birth_time text,
  birth_country text not null,
  payment_id text,
  payment_status text default 'pending',
  
  -- 사주 팔자 결과
  year_pillar text,
  month_pillar text,
  day_pillar text,
  hour_pillar text,
  five_elements_analysis text,
  sinsal text,
  il_gan text,
  ten_gods_present text,
  ten_gods_missing text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 인덱스 생성
create index if not exists saju_readings_email_idx on public.saju_readings(email);
create index if not exists saju_readings_payment_id_idx on public.saju_readings(payment_id);

-- RLS 활성화
alter table public.saju_readings enable row level security;

-- 누구나 자신의 이메일로 조회 가능 (이메일 기반 조회)
create policy "saju_readings_select_by_email" on public.saju_readings 
  for select using (true);

-- 인서트는 모든 사람이 가능 (결제 전)
create policy "saju_readings_insert" on public.saju_readings 
  for insert with check (true);

-- 업데이트는 결제 완료 시 서비스 역할로만
create policy "saju_readings_update" on public.saju_readings 
  for update using (true);
