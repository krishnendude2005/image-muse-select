-- Create search_history table
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_term TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);

-- Create index on timestamp for sorting
CREATE INDEX idx_search_history_timestamp ON public.search_history(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own search history
CREATE POLICY "Users can view their own search history"
ON public.search_history
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to insert their own searches
CREATE POLICY "Users can insert their own search history"
ON public.search_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create a function to get top searches across all users
CREATE OR REPLACE FUNCTION public.get_top_searches(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (search_term TEXT, search_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sh.search_term,
    COUNT(*) as search_count
  FROM public.search_history sh
  GROUP BY sh.search_term
  ORDER BY search_count DESC, sh.search_term ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;