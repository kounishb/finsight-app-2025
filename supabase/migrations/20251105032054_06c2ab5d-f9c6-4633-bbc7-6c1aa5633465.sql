-- Add current_price and change columns to portfolio table to cache stock prices
ALTER TABLE public.portfolio 
ADD COLUMN IF NOT EXISTS current_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS change NUMERIC DEFAULT 0;