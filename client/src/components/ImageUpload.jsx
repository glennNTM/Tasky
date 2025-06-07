
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";

const ImageUpload = ({ currentImage, onImageChange, className = "" }) => {
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image valide");
      return;
    }

    // Vérification de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result;
      setPreview(imageUrl);
      if (onImageChange) {
        onImageChange(file, imageUrl);
      }
      toast.success("Image sélectionnée avec succès");
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <Avatar className="h-24 w-24">
          {preview ? (
            <AvatarImage src={preview} alt="Profile" className="object-cover" />
          ) : (
            <AvatarFallback className="bg-green-600 text-white text-2xl">
              <Camera className="h-8 w-8" />
            </AvatarFallback>
          )}
        </Avatar>
        <Button
          size="sm"
          onClick={handleButtonClick}
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 p-0"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400"
      >
        <Upload className="h-4 w-4 mr-2" />
        Changer la photo
      </Button>
    </div>
  );
};

export default ImageUpload;
