import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface LogoUploadProps {
  logo?: string;
  onLogoChange: (logo: string | undefined) => void;
}

const LogoUpload = ({ logo, onLogoChange }: LogoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onLogoChange(base64);
      toast.success("Logo uploaded successfully");
    };
    reader.onerror = () => {
      toast.error("Failed to upload logo");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onLogoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Logo removed");
  };

  return (
    <div className="space-y-4">
      <Label>Company Logo</Label>
      {logo ? (
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-lg border-2 border-border overflow-hidden bg-card">
            <img
              src={logo}
              alt="Company logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Logo uploaded</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveLogo}
              className="w-fit"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full md:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Logo
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG or WEBP (max 2MB)
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default LogoUpload;
