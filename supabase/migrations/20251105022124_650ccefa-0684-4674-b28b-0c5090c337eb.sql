-- Create portfolio table for storing user stock holdings
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio table
CREATE POLICY "Users can view their own portfolio"
  ON public.portfolio
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own portfolio"
  ON public.portfolio
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio"
  ON public.portfolio
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own portfolio"
  ON public.portfolio
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create finsights table for storing user's financial insights/watchlist
CREATE TABLE IF NOT EXISTS public.finsights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL DEFAULT 0,
  change DECIMAL NOT NULL DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.finsights ENABLE ROW LEVEL SECURITY;

-- Create policies for finsights table
CREATE POLICY "Users can view their own finsights"
  ON public.finsights
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own finsights"
  ON public.finsights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own finsights"
  ON public.finsights
  FOR DELETE
  USING (auth.uid() = user_id);