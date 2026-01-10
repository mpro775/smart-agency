import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadFile, uploadFiles } from '../../services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  placeholder = 'اسحب الصورة هنا أو انقر للاختيار',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('يجب اختيار ملف صورة');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 5MB');
        return;
      }

      setIsUploading(true);
      try {
        const url = await uploadFile(file);
        onChange(url);
        toast.success('تم رفع الصورة بنجاح');
      } catch (error) {
        toast.error('فشل رفع الصورة');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (value) {
    return (
      <div className={cn('relative rounded-xl overflow-hidden group', className)}>
        <img
          src={value}
          alt="Uploaded"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={onRemove}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-xl p-8 text-center transition-colors',
        isDragging
          ? 'border-emerald-500 bg-emerald-500/10'
          : 'border-slate-700 hover:border-slate-600',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <>
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            <p className="text-slate-400">جاري رفع الصورة...</p>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-slate-800">
              <Upload className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-400">{placeholder}</p>
            <p className="text-xs text-slate-500">PNG, JPG, WEBP حتى 5MB</p>
          </>
        )}
      </div>
    </div>
  );
}

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  className?: string;
  maxImages?: number;
}

export function GalleryUpload({
  value = [],
  onChange,
  className,
  maxImages = 10,
}: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList) => {
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} ليس ملف صورة`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} حجمه أكبر من 5MB`);
          return false;
        }
        return true;
      });

      if (value.length + validFiles.length > maxImages) {
        toast.error(`الحد الأقصى ${maxImages} صور`);
        return;
      }

      if (validFiles.length === 0) return;

      setIsUploading(true);
      try {
        const urls = await uploadFiles(validFiles);
        onChange([...value, ...urls]);
        toast.success(`تم رفع ${urls.length} صورة`);
      } catch (error) {
        toast.error('فشل رفع الصور');
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, maxImages]
  );

  const handleRemove = (index: number) => {
    const newUrls = [...value];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload area */}
      <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-slate-600 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading || value.length >= maxImages}
        />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
              <p className="text-slate-400">جاري رفع الصور...</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-slate-500" />
              <p className="text-slate-400">اسحب الصور أو انقر للاختيار</p>
              <p className="text-xs text-slate-500">
                {value.length} / {maxImages} صور
              </p>
            </>
          )}
        </div>
      </div>

      {/* Gallery preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

