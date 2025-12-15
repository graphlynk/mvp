import { User } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe } from "lucide-react";
import { EntityIngestionTool } from "@/components/EntityIngestionTool";

interface AdminSectionProps {
  user: User;
}

export function AdminSection({ user }: AdminSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Tools</h2>
        <p className="text-gray-600 text-lg">
          Manage entity ingestion and system administration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EntityIngestionTool />
        <Link href="/entities">
          <Card className="hover-elevate cursor-pointer h-full bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-gray-900">Browse Entities</CardTitle>
                  <CardDescription className="text-gray-600">
                    View all unclaimed entity profiles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-browse-entities">
                Browse Unclaimed Entities
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
