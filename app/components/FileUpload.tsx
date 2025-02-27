"use client";
import { useRef, useState } from "react";
import { IKUpload } from "imagekitio-next";

import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
  onProgress: (progress: number) => void;
  onSuccess: (res: IKUploadResponse) => void;

  fileType: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    console.log(err);
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    console.log(res);
    onSuccess(res);
    setUploading(false);
    setError(null);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = Math.round((evt.loaded / evt.total) * 100);
      onProgress(Math.round(percentComplete));
    }
  };
  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video")) {
        setError("Please select a video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("File size should be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

      if (!validTypes.includes(file.type)) {
        setError("Please select an image file");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return false;
      }
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        useUniqueFileName={true}
        validateFile={validateFile}
        onError={onError}
        onUploadProgress={handleProgress}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        folder={fileType === "video" ? "/videos" : "/images"}
        accept={fileType === "video" ? "video/*" : "image/*"}
        className="file-input file-input-bordered file-input-info w-full max-w-xs"
      />

      {uploading && (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Uploading...</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
