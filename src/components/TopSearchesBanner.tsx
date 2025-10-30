import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TopSearch {
  search_term: string;
  search_count: number;
}

export const TopSearchesBanner = () => {
  const { data: topSearches, isLoading } = useQuery({
    queryKey: ["top-searches"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_top_searches", {
        limit_count: 5,
      });

      if (error) throw error;
      return data as TopSearch[];
    },
  });

  if (isLoading || !topSearches || topSearches.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-primary/5 border-b border-border py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>Top Searches:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {topSearches.map((search) => (
            <Badge
              key={search.search_term}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
            >
              {search.search_term} ({search.search_count})
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
