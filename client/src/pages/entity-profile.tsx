import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Calendar, CheckCircle, TrendingUp, Users, Award, History } from "lucide-react";
import { Helmet } from "react-helmet";

interface EntityData {
  id: string;
  userId: string;
  type: string;
  slug: string;
  name: string;
  description: string | null;
  status: string;
  visibility: string;
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
  sources: Array<{
    id: string;
    url: string;
    sourceType: string;
    verifiedAt: string | null;
    score: number;
  }>;
  relationships: Array<{
    id: string;
    fromEntityId: string;
    toEntityId: string;
    relationshipType: string;
    confidence: number;
  }>;
  verifications: Array<{
    id: string;
    verificationType: string;
    status: string;
    verifiedAt: string | null;
  }>;
  score: {
    authorityScore: number;
    engagementScore: number;
    freshnessScore: number;
    notabilityScore: number;
    computedAt: string;
  } | null;
}

export default function EntityProfile() {
  const [, params] = useRoute("/entity/:slug");
  const slug = params?.slug || "";

  const { data: entity, isLoading, error } = useQuery<EntityData>({
    queryKey: ["/api/entity", slug],
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="space-y-4">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Entity Not Found</CardTitle>
            <CardDescription>
              The entity you're looking for doesn't exist or is not publicly available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate JSON-LD schema.org markup
  const generateJsonLd = () => {
    const baseSchema: any = {
      "@context": "https://schema.org",
      "@type": getSchemaType(entity.type),
      name: entity.name,
      description: entity.description,
      url: `${window.location.origin}/entity/${entity.slug}`,
      identifier: entity.id,
    };

    // Add verified sources as sameAs
    if (entity.sources && entity.sources.length > 0) {
      baseSchema.sameAs = entity.sources
        .filter(s => s.verifiedAt)
        .map(s => s.url);
    }

    // Add relationships
    if (entity.relationships && entity.relationships.length > 0) {
      entity.relationships.forEach(rel => {
        const property = mapRelationshipToSchema(rel.relationshipType);
        if (property) {
          baseSchema[property] = {
            "@type": "Thing",
            identifier: rel.toEntityId,
          };
        }
      });
    }

    return baseSchema;
  };

  const getSchemaType = (type: string): string => {
    const typeMap: Record<string, string> = {
      person: "Person",
      organization: "Organization",
      product: "Product",
      event: "Event",
      creative_work: "CreativeWork",
      place: "Place",
    };
    return typeMap[type] || "Thing";
  };

  const mapRelationshipToSchema = (relType: string): string | null => {
    const relationshipMap: Record<string, string> = {
      memberOf: "memberOf",
      worksFor: "worksFor",
      foundedBy: "founder",
      partnerOf: "partner",
      owns: "owns",
    };
    return relationshipMap[relType] || null;
  };

  const jsonLd = generateJsonLd();

  const verifiedCount = entity.verifications?.filter(v => v.status === "verified").length || 0;
  const notabilityScore = entity.score?.notabilityScore || 0;

  return (
    <>
      <Helmet>
        <title>{entity.name} - Graphlynk Knowledge Graph</title>
        <meta name="description" content={entity.description || `${entity.name} - Knowledge Graph Entity`} />
        <meta property="og:title" content={entity.name} />
        <meta property="og:description" content={entity.description || ""} />
        <meta property="og:type" content="profile" />
        <link rel="canonical" href={`${window.location.origin}/entity/${entity.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="container max-w-4xl py-12">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold" data-testid="text-entity-name">{entity.name}</h1>
                {verifiedCount > 0 && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{entity.type.replace("_", " ")}</Badge>
                <Badge variant="outline">{entity.status}</Badge>
              </div>
            </div>
          </div>

          {entity.description && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid="text-entity-description">
                  {entity.description}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {entity.score && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Authority Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Notability</span>
                    <span className="font-semibold">{entity.score.notabilityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Authority</span>
                    <span className="font-semibold">{entity.score.authorityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Engagement</span>
                    <span className="font-semibold">{entity.score.engagementScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Freshness</span>
                    <span className="font-semibold">{entity.score.freshnessScore}/100</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Verified Sources</span>
                  <span className="font-semibold">{entity.sources?.filter(s => s.verifiedAt).length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Verifications</span>
                  <span className="font-semibold">{verifiedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Relationships</span>
                  <span className="font-semibold">{entity.relationships?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {entity.sources && entity.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Verified Sources</CardTitle>
                <CardDescription>Authenticated external links and references</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entity.sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{source.sourceType}</Badge>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline flex items-center gap-1"
                          data-testid={`link-source-${source.sourceType}`}
                        >
                          {source.url.length > 50 ? source.url.substring(0, 50) + "..." : source.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      {source.verifiedAt && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {entity.relationships && entity.relationships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Relationships</CardTitle>
                <CardDescription>Connections in the knowledge graph</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entity.relationships.map((rel) => (
                    <div key={rel.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{rel.relationshipType}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Connected entity: {rel.toEntityId}
                        </span>
                      </div>
                      <Badge variant="outline">{rel.confidence}% confidence</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transparency
              </CardTitle>
              <CardDescription>Public audit and verification information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Entity Created</span>
                <span className="text-sm">{new Date(entity.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">{new Date(entity.updatedAt).toLocaleDateString()}</span>
              </div>
              <Separator />
              <Link href={`/entity/${entity.slug}/revisions`}>
                <Button variant="outline" className="w-full" data-testid="button-view-revisions">
                  View Edit History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
