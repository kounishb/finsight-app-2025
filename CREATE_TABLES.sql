-- Run this SQL in your Supabase SQL Editor to create the portfolio and finsights tables

-- Create portfolio table
CREATE TABLE IF NOT EXISTS public.portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol text NOT NULL,
  name text NOT NULL,
  shares numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, symbol)
);

-- Enable RLS on portfolio
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Portfolio policies
CREATE POLICY "Users can view their own portfolio"
  ON public.portfolio
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio items"
  ON public.portfolio
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items"
  ON public.portfolio
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items"
  ON public.portfolio
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create finsights table
CREATE TABLE IF NOT EXISTS public.finsights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol text NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL,
  change numeric NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, symbol)
);

-- Enable RLS on finsights
ALTER TABLE public.finsights ENABLE ROW LEVEL SECURITY;

-- Finsights policies
CREATE POLICY "Users can view their own finsights"
  ON public.finsights
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own finsights"
  ON public.finsights
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own finsights"
  ON public.finsights
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
