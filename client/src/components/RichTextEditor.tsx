import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanitizeHtml } from "@/lib/sanitize";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Code, Image as ImageIcon } from "lucide-react";
import { SimpleFileUpload } from "./SimpleFileUpload";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  showImageUpload?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter your content...",
  maxLength,
  rows = 10,
  showImageUpload = false,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("edit");

  const insertImageUrl = (url: string) => {
    const imageTag = `<img src="${url}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
    onChange(value + "\n" + imageTag);
  };

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <TabsList>
            <TabsTrigger value="edit" data-testid="tab-edit">
              <Code className="w-4 h-4 mr-2" />
              Edit HTML
            </TabsTrigger>
            <TabsTrigger value="preview" data-testid="tab-preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          {showImageUpload && (
            <SimpleFileUpload
              onUploadComplete={insertImageUrl}
              accept="image/*"
              maxSizeMB={5}
              buttonText="Add Image"
              className="shrink-0"
            />
          )}
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className="font-mono text-sm"
            data-testid="input-richtext"
          />
          {maxLength && (
            <div className="text-xs text-muted-foreground text-right mt-1">
              {value.length}/{maxLength}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            <p className="font-semibold">Supported HTML tags:</p>
            <p>Headings: &lt;h1&gt; to &lt;h6&gt;</p>
            <p>Text: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;u&gt;, &lt;s&gt;</p>
            <p>Links: &lt;a href="..."&gt;</p>
            <p>Lists: &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;</p>
            <p>Images: &lt;img src="..." alt="..."&gt;</p>
            <p>Code: &lt;code&gt;, &lt;pre&gt;</p>
            <p>Styles: Use inline style="..." for custom CSS</p>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <Card>
            <CardContent className="p-6">
              {value ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
                  data-testid="preview-content"
                />
              ) : (
                <p className="text-muted-foreground italic">Nothing to preview yet...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
