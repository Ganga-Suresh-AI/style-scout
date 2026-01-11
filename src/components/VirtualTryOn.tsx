import { useState, useRef } from 'react';
import { TryOnImages } from '@/types/fashion';
import { Camera, Shirt, Upload, X, ImageIcon } from 'lucide-react';

interface VirtualTryOnProps {
  images: TryOnImages;
  onImagesChange: (images: TryOnImages) => void;
}

const VirtualTryOn = ({ images, onImagesChange }: VirtualTryOnProps) => {
  const [dragOver, setDragOver] = useState<'selfie' | 'clothing' | null>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    file: File | null,
    type: 'selfie' | 'clothing'
  ) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImagesChange({
          ...images,
          [type]: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    type: 'selfie' | 'clothing'
  ) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file, type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (type: 'selfie' | 'clothing') => {
    onImagesChange({
      ...images,
      [type]: null,
    });
  };

  const UploadZone = ({
    type,
    icon: Icon,
    label,
    sublabel,
  }: {
    type: 'selfie' | 'clothing';
    icon: typeof Camera;
    label: string;
    sublabel: string;
  }) => {
    const inputRef = type === 'selfie' ? selfieInputRef : clothingInputRef;
    const image = images[type];

    return (
      <div className="relative">
        {image ? (
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-card">
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(type)}
              className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              aria-label={`Remove ${label}`}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
              <p className="text-primary-foreground text-sm font-medium">{label}</p>
            </div>
          </div>
        ) : (
          <div
            className={`upload-zone aspect-[3/4] ${
              dragOver === type ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => inputRef.current?.click()}
            onDrop={(e) => handleDrop(e, type)}
            onDragOver={handleDragOver}
            onDragEnter={() => setDragOver(type)}
            onDragLeave={() => setDragOver(null)}
          >
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground">{sublabel}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="h-4 w-4" />
              <span>Drop or click to upload</span>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null, type)}
          className="hidden"
        />
      </div>
    );
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <ImageIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground">
            Virtual Try-On Preview
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload your photo and a clothing item to visualize
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <UploadZone
          type="selfie"
          icon={Camera}
          label="Your Photo"
          sublabel="Upload a reference selfie"
        />
        <UploadZone
          type="clothing"
          icon={Shirt}
          label="Clothing Item"
          sublabel="Upload outfit to preview"
        />
      </div>

      {images.selfie && images.clothing && (
        <div className="mt-6 p-4 bg-accent/50 rounded-xl">
          <p className="text-center text-accent-foreground">
            <span className="font-medium">Preview Mode:</span> Your uploaded images are displayed above. 
            In a full implementation, these would be combined using image processing technology.
          </p>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
