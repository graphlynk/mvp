import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";

interface SimpleFileUploadProps {
  onUploadComplete: (objectPath: string) => void;
  accept?: string;
  maxSizeMB?: number;
  buttonText?: string;
  className?: string;
  finalizeEndpoint?: string;
}

export function SimpleFileUpload({
  onUploadComplete,
  accept = "image/*",
  maxSizeMB = 5,
  buttonText = "Upload File",
  className = "",
  finalizeEndpoint = "/api/objects/finalize",
}: SimpleFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadUrlResponse = await apiRequest("POST", "/api/objects/upload", {});
      const { uploadURL } = (await uploadUrlResponse.json()) as { uploadURL: string };

      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const finalizeResponse = await apiRequest("PUT", finalizeEndpoint, {
        avatarURL: uploadURL,
        uploadURL: uploadURL,
      });

      const { objectPath } = (await finalizeResponse.json()) as { objectPath: string };

      onUploadComplete(objectPath);
      
      toast({
        title: "Upload Successful!",
        description: "Your file has been uploaded",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={className}
        data-testid="button-upload"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>
    </>
  );
}
