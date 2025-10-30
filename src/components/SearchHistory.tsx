import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface SearchHistoryItem {
  id: string;
  search_term: string;
  timestamp: string;
}

export const SearchHistory = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ["search-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("search_history")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as SearchHistoryItem[];
    },
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Search History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] px-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground py-4">Loading...</p>
          )}
          {!isLoading && (!history || history.length === 0) && (
            <p className="text-sm text-muted-foreground py-4">
              No search history yet
            </p>
          )}
          {!isLoading && history && history.length > 0 && (
            <div className="space-y-3 pb-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-border pb-2 last:border-0"
                >
                  <p className="font-medium text-sm">{item.search_term}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
