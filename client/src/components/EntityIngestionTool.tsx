import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Database } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function EntityIngestionTool() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"wikipedia" | "musicbrainz">("wikipedia");
  const [isIngesting, setIsIngesting] = useState(false);
  const [result, setResult] = useState<{ count: number; entityIds: string[] } | null>(null);
  const { toast } = useToast();

  const handleIngest = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsIngesting(true);
    setResult(null);

    try {
      const response = await apiRequest("POST", "/api/entities/ingest", {
        query: query.trim(),
        source,
      }) as unknown as { count: number; entityIds: string[] };

      setResult(response);
      toast({
        title: "Success!",
        description: `Created ${response.count} entities from ${source}`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/entities/unclaimed"] });
    } catch (error: any) {
      toast({
        title: "Ingestion Failed",
        description: error.message || "Failed to ingest entities",
        variant: "destructive",
      });
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm" data-testid="card-entity-ingestion">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <Database className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-gray-900">Entity Ingestion</CardTitle>
            <CardDescription className="text-gray-600">
              Auto-create entities from Wikipedia, MusicBrainz, and other sources
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-query" className="text-gray-900">Search Query</Label>
          <Input
            id="search-query"
            data-testid="input-entity-search"
            placeholder="e.g., Taylor Swift, The Beatles, Tesla Inc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleIngest()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data-source" className="text-gray-900">Data Source</Label>
          <Select value={source} onValueChange={(value: any) => setSource(value)}>
            <SelectTrigger id="data-source" data-testid="select-data-source">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wikipedia">Wikipedia</SelectItem>
              <SelectItem value="musicbrainz">MusicBrainz (Music Artists)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleIngest} 
          disabled={isIngesting || !query.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="button-ingest-entities"
        >
          {isIngesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ingesting Entities...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Search & Create Entities
            </>
          )}
        </Button>

        {result && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200" data-testid="ingestion-result">
            <p className="font-semibold text-sm text-green-900">
              ✅ Successfully created {result.count} entities
            </p>
            {result.count > 0 && (
              <p className="text-xs text-green-700 mt-1">
                These entities are now available for claiming
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
