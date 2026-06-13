-- Run this in your Supabase SQL Editor

-- Create the users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  preferred_name text,
  exams text[] -- Array of text to store 'NEET', 'CUET', 'JEE', etc.
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policy for users to insert their own profile
create policy "Users can insert their own profile."
on public.users for insert
with check ( auth.uid() = id );

-- Create policy for users to select their own profile
create policy "Users can view their own profile."
on public.users for select
using ( auth.uid() = id );

-- Create policy for users to update their own profile
create policy "Users can update their own profile."
on public.users for update
using ( auth.uid() = id );
