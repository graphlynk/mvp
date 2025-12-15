import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

interface SEOInsight {
  category: string;
  insight: string;
  priority: 'high' | 'medium' | 'low';
  actionable: string;
}

export function AIInsights() {
  const { data, isLoading } = useQuery<{ insights: SEOInsight[] }>({
    queryKey: ['/api/ai/insights'],
  });

  const priorityColors = {
    high: 'destructive',
    medium: 'default',
    low: 'secondary'
  } as const;

  const priorityIcons = {
    high: AlertCircle,
    medium: TrendingUp,
    low: Lightbulb
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm" data-testid="card-ai-insights-loading">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            AI Insights
          </CardTitle>
          <CardDescription className="text-gray-600">Analyzing your SEO performance...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const insights = data?.insights || [];

  return (
    <Card className="bg-white border-gray-200 shadow-sm" data-testid="card-ai-insights">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          AI Insights
        </CardTitle>
        <CardDescription className="text-gray-600">
          Intelligent recommendations to boost your SEO
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Create your profile to get personalized AI insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, i) => {
              const Icon = priorityIcons[insight.priority];
              return (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover-elevate"
                  data-testid={`insight-${i}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${
                      insight.priority === 'high' ? 'bg-red-100' :
                      insight.priority === 'medium' ? 'bg-blue-100' :
                      'bg-green-100'
                    } flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${
                        insight.priority === 'high' ? 'text-red-600' :
                        insight.priority === 'medium' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">{insight.category}</h4>
                        <Badge variant={priorityColors[insight.priority]} className="text-xs">
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.insight}</p>
                      <div className="text-xs font-medium text-blue-600">
                        💡 {insight.actionable}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
