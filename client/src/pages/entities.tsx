import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Globe, Award, MapPin, Building2, User as UserIcon, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface Entity {
  id: string;
  name: string;
  type: string;
  slug: string;
  description?: string;
  claimStatus: string;
  ingestionSource?: string;
  createdAt: string;
}

export default function Entities() {
  const { toast } = useToast();
  
  const { data: entities, isLoading } = useQuery<Entity[]>({
    queryKey: ["/api/entities/unclaimed"],
  });

  const handleClaim = async (entityId: string, entityName: string) => {
    try {
      await apiRequest("POST", "/api/entities/claim", {
        entityId,
        claimMethod: "manual_review",
      });

      toast({
        title: "Entity Claimed!",
        description: `You have successfully claimed "${entityName}"`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/entities/unclaimed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/entities/my-claims"] });
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim entity",
        variant: "destructive",
      });
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'person': return <UserIcon className="w-5 h-5" />;
      case 'organization': return <Building2 className="w-5 h-5" />;
      case 'place': return <MapPin className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Browse Entities</h1>
              <p className="text-sm text-muted-foreground">Claim notable entities and build your Knowledge Graph</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !entities || entities.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No Unclaimed Entities</h2>
              <p className="text-muted-foreground mb-4">Use the Entity Ingestion tool to create entities from Wikipedia or MusicBrainz</p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entities.map((entity) => (
              <Card key={entity.id} className="hover-elevate" data-testid={`card-entity-${entity.slug}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {getEntityIcon(entity.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{entity.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {entity.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3 line-clamp-3">
                    {entity.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    {entity.ingestionSource && (
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span className="capitalize">{entity.ingestionSource}</span>
                      </div>
                    )}
                    <span>{new Date(entity.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Button
                    onClick={() => handleClaim(entity.id, entity.name)}
                    className="w-full"
                    data-testid={`button-claim-${entity.slug}`}
                  >
                    Claim Entity
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
