import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";

interface Image {
  id: string;
  url: string;
  description: string;
}

interface ImageGridProps {
  images: Image[];
  searchTerm: string;
}

export const ImageGrid = ({ images, searchTerm }: ImageGridProps) => {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const toggleImage = (imageId: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">
          You searched for <span className="text-primary">{searchTerm}</span> -- {images.length} results
        </p>
        {selectedImages.size > 0 && (
          <Badge variant="default" className="text-base px-4 py-2">
            Selected: {selectedImages.size} {selectedImages.size === 1 ? "image" : "images"}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden border border-border bg-muted hover:shadow-lg transition-shadow"
            onClick={() => toggleImage(image.id)}
          >
            <div className="aspect-square relative bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
              <img
                src={image.url}
                alt={image.description}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </div>
            
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-background/90 rounded-md p-1.5 shadow-md">
                <Checkbox
                  checked={selectedImages.has(image.id)}
                  onCheckedChange={() => toggleImage(image.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="p-3 bg-background/95">
              <p className="text-sm text-muted-foreground truncate">
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
