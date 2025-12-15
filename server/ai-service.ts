import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export interface SEOInsight {
  category: string;
  insight: string;
  priority: 'high' | 'medium' | 'low';
  actionable: string;
}

export interface ContentOptimization {
  title: string;
  suggestions: string[];
  score: number;
}

export interface EntityExtraction {
  entities: Array<{
    name: string;
    type: 'Person' | 'Organization' | 'Product' | 'Event' | 'CreativeWork' | 'Place';
    confidence: number;
  }>;
}

export class AIService {
  
  async generateSEOInsights(userProfile: any): Promise<SEOInsight[]> {
    const prompt = `Analyze this user's SEO profile and provide 3-5 actionable insights:

Profile: ${userProfile.bio || 'No bio'}
Links: ${userProfile.links?.length || 0} links
Posts: ${userProfile.posts?.length || 0} blog posts

Provide insights in JSON format:
{
  "insights": [
    {
      "category": "Content Strategy",
      "insight": "Your insight here",
      "priority": "high|medium|low",
      "actionable": "Specific action to take"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{"insights":[]}');
    return result.insights || [];
  }

  async optimizeContent(content: string, type: 'blog' | 'bio' | 'link'): Promise<ContentOptimization> {
    const typeGuide = {
      blog: 'SEO-optimized blog post with keywords and readability',
      bio: 'compelling professional bio for maximum engagement',
      link: 'effective link description with clear value proposition'
    };

    const prompt = `Analyze and optimize this ${type} content for ${typeGuide[type]}:

"${content}"

Provide optimization suggestions in JSON format:
{
  "title": "Suggested optimized title/headline",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "score": 85
}

Score from 0-100 based on SEO quality, readability, and engagement potential.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{"title":"","suggestions":[],"score":50}');
    return result;
  }

  async extractEntities(text: string): Promise<EntityExtraction> {
    const prompt = `Extract knowledge graph entities from this text:

"${text}"

Identify entities that could be added to a knowledge graph. Return JSON:
{
  "entities": [
    {
      "name": "Entity Name",
      "type": "Person|Organization|Product|Event|CreativeWork|Place",
      "confidence": 0.95
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{"entities":[]}');
    return result;
  }

  async chatAssistant(message: string, context?: any): Promise<string> {
    try {
      const systemPrompt = `You are an intelligent SEO and Knowledge Graph assistant for Graphlynk. 
You help users optimize their online presence, build authority, and improve search rankings.

You can:
- Provide SEO advice and strategies
- Help with content optimization
- Explain knowledge graph concepts
- Suggest improvements for link profiles
- Analyze search performance
- Guide users on schema markup

Be concise, actionable, and friendly.`;

      const contextString = context ? `\n\nUser Context: ${JSON.stringify(context)}` : '';

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message + contextString }
        ],
        max_completion_tokens: 1024,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.error("OpenAI response missing content:", JSON.stringify(response, null, 2));
        return "I'm sorry, I couldn't process that request.";
      }
      
      return content;
    } catch (error: any) {
      console.error("AI chat assistant error:", error.message || error);
      console.error("Error details:", error);
      return "I'm sorry, I encountered an error processing your request. Please try again.";
    }
  }

  async generateSmartAnalytics(userData: any): Promise<any> {
    const prompt = `Analyze this user's Graphlynk data and provide intelligent insights:

User: ${userData.email}
Plan: ${userData.plan}
Profile Links: ${userData.profileLinks || 0}
Blog Posts: ${userData.blogPosts || 0}
Subscribers: ${userData.subscribers || 0}

Provide actionable analytics in JSON format:
{
  "overallScore": 75,
  "strengths": ["strength 1", "strength 2"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "nextSteps": ["action 1", "action 2", "action 3"],
  "prediction": "Growth forecast based on current trajectory"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    return result;
  }
}

export const aiService = new AIService();
