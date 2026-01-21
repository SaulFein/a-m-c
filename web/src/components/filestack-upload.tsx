"use client";

import * as React from "react";
import * as filestack from "filestack-js";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getFilestackUrl } from "@/lib/utils";
import { type FilestackFile } from "@/lib/validations/car";

// Initialize Filestack client
const client = filestack.init(process.env.NEXT_PUBLIC_FILESTACK_API_KEY || "");

interface FilestackUploadProps {
  value: FilestackFile | FilestackFile[] | null;
  onChange: (value: FilestackFile | FilestackFile[] | null) => void;
  multiple?: boolean;
  accept?: string[];
  maxFiles?: number;
  label?: string;
}

export function FilestackUpload({
  value,
  onChange,
  multiple = false,
  accept = ["image/*"],
  maxFiles = 10,
  label = "Upload Image",
}: FilestackUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUpload = async () => {
    if (!process.env.NEXT_PUBLIC_FILESTACK_API_KEY) {
      console.error("Filestack API key not configured");
      return;
    }

    setIsUploading(true);

    try {
      const options: filestack.PickerOptions = {
        accept,
        maxFiles: multiple ? maxFiles : 1,
        onUploadDone: (result) => {
          const files = result.filesUploaded.map((file) => ({
            url: file.url,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            handle: file.handle,
          }));

          if (multiple) {
            // Append to existing files
            const existing = Array.isArray(value) ? value : value ? [value] : [];
            onChange([...existing, ...files]);
          } else {
            onChange(files[0] || null);
          }
        },
      };

      await client.picker(options).open();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index?: number) => {
    if (multiple && typeof index === "number") {
      const files = Array.isArray(value) ? value : [];
      const updated = files.filter((_, i) => i !== index);
      onChange(updated.length > 0 ? updated : null);
    } else {
      onChange(null);
    }
  };

  // Render single image preview
  const renderSinglePreview = () => {
    const file = value as FilestackFile | null;
    if (!file) return null;

    const imageUrl = getFilestackUrl(file, { width: 200, height: 150, fit: "crop" });

    return (
      <div className="relative inline-block">
        <div className="relative h-[150px] w-[200px] overflow-hidden rounded-lg border bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={file.filename || "Uploaded image"}
              fill
              className="object-cover"
              sizes="200px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -right-2 -top-2 h-6 w-6"
          onClick={() => handleRemove()}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Render multiple images preview
  const renderMultiplePreview = () => {
    const files = Array.isArray(value) ? value : [];
    if (files.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-4">
        {files.map((file, index) => {
          const imageUrl = getFilestackUrl(file, { width: 150, height: 100, fit: "crop" });

          return (
            <div key={file.handle || file.id || index} className="relative">
              <div className="relative h-[100px] w-[150px] overflow-hidden rounded-lg border bg-muted">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={file.filename || `Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-5 w-5"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      {multiple ? renderMultiplePreview() : renderSinglePreview()}

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleUpload}
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : label}
      </Button>

      {/* No API key warning */}
      {!process.env.NEXT_PUBLIC_FILESTACK_API_KEY && (
        <p className="text-sm text-muted-foreground">
          Filestack API key not configured. Add NEXT_PUBLIC_FILESTACK_API_KEY to .env
        </p>
      )}
    </div>
  );
}
