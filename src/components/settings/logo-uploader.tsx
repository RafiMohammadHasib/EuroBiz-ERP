'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFirestore, useFirebaseApp } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, Check } from 'lucide-react';

interface LogoUploaderProps {
  currentLogoUrl: string;
  onUploadComplete: (newUrl: string) => void;
}

export function LogoUploader({ currentLogoUrl, onUploadComplete }: LogoUploaderProps) {
  const { toast } = useToast();
  const firebaseApp = useFirebaseApp();
  const firestore = useFirestore();

  const [isUploading, setIsUploading] = useState(false);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!newLogoFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a logo file to upload.',
      });
      return;
    }

    setIsUploading(true);

    try {
      const storage = getStorage(firebaseApp);
      // Using a fixed name for the company logo to overwrite it each time
      const storageRef = ref(storage, 'company_assets/logo');
      
      const snapshot = await uploadBytes(storageRef, newLogoFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update the settings document in Firestore
      const settingsRef = doc(firestore, 'settings', 'business');
      await setDoc(settingsRef, { logoUrl: downloadURL }, { merge: true });

      onUploadComplete(downloadURL); // Notify parent component

      toast({
        title: 'Logo Uploaded',
        description: 'Your new company logo has been saved.',
      });
      setNewLogoFile(null);
      setPreviewUrl(null);

    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Could not upload the logo. Please check your storage rules.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const logoToShow = previewUrl || currentLogoUrl;

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center relative overflow-hidden border">
                {logoToShow ? (
                    <Image src={logoToShow} alt="Company Logo" layout="fill" objectFit="contain" />
                ) : (
                    <Upload className="h-10 w-10 text-muted-foreground" />
                )}
            </div>
            <div className="grid gap-2 flex-1">
                <Label htmlFor="logo-file">Select new logo</Label>
                <Input id="logo-file" type="file" accept="image/png, image/jpeg, image/gif, image/svg+xml" onChange={handleFileChange} disabled={isUploading} />
                <p className="text-xs text-muted-foreground">Recommended: .PNG with transparent background.</p>
            </div>
        </div>
         {newLogoFile && (
            <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                {isUploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                   <>
                     <Upload className="mr-2 h-4 w-4" />
                     Upload and Save Logo
                   </>
                )}
            </Button>
        )}
    </div>
  );
}
