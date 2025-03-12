create table public.interview_answers (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    category text null,
    question text not null,
    answer text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    model text not null
);

create table public.knowledge_answers (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    category text null,
    question text not null,
    answer text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    model text not null
);