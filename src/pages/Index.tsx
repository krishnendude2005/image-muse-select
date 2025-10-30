import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TopSearchesBanner } from "@/components/TopSearchesBanner";
import { SearchHistory } from "@/components/SearchHistory";
import { ImageGrid } from "@/components/ImageGrid";
import { toast } from "sonner";
import { Search, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Image {
  id: string;
  url: string;
  description: string;
}

const Index = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<Image[]>([]);
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setIsSearching(true);
    
    try {
      // Store search in database
      const { error: insertError } = await supabase
        .from("search_history")
        .insert({
          user_id: user.id,
          search_term: searchTerm.trim(),
        });

      if (insertError) throw insertError;

      // Fetch mock images (placeholder until Unsplash API key is added)
      const mockImages: Image[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${searchTerm}-${i}`,
        url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=400&fit=crop`,
        description: `${searchTerm} - Image ${i + 1}`,
      }));

      setImages(mockImages);
      setLastSearchTerm(searchTerm.trim());
      
      // Refresh top searches and history
      queryClient.invalidateQueries({ queryKey: ["top-searches"] });
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
      
      toast.success("Search completed!");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to perform search");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopSearchesBanner />
      
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Image Search</h1>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>

            <ImageGrid images={images} searchTerm={lastSearchTerm} />
          </div>

          <div className="lg:col-span-1">
            <SearchHistory />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
