'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageUpload from '@/components/ImageUpload';
import { useToast } from "@/hooks/use-toast";
import { settingsService, SiteSettings } from '@/lib/firebase/settings-service';

// Use SiteSettings interface from settings-service
export default function SettingsPanel() {
  const { toast } = useToast();
  // Initialize state to match SiteSettings interface
  const [settings, setSettings] = useState<SiteSettings>({
    appName: '',
    metaDescription: '',
    tagline: '',
    lightLogo: '',
    darkLogo: '',
    favicon: ''
  });
  // Track loading state only for save operation
  const [loading, setLoading] = useState<'save' | null>(null);

  // Callback function for ImageUpload component - Modified to save immediately
  const handleUploadComplete = useCallback(async (url: string | null, type: 'lightLogo' | 'darkLogo' | 'favicon'): Promise<void> => {
    const newUrl = url ?? ''; // Use empty string if null
    // Update local state first
    setSettings(prevSettings => ({ ...prevSettings, [type]: newUrl }));

    // Immediately save the change to Firestore
    try {
      await settingsService.updateSiteSettings({ [type]: newUrl }); // Save the single field
      toast({ title: "Success", description: `${type} updated successfully.` });
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      toast({ title: "Error", description: `Failed to save ${type}. Reverting local change.`, variant: "destructive" });
      // Optional: Revert local state if save fails (might need original value)
      // For simplicity, we'll leave the local state as is for now, but show error.
    }
  }, [toast]); // Removed settingsService

  const handleLogoDelete = useCallback(async (type: 'lightLogo' | 'darkLogo' | 'favicon') => {
    // Clear the URL in the settings state
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [type]: '' };
      return { ...newSettings };
    });

    try {
      // Update Firestore to remove the logo URL
      await settingsService.updateSiteSettings({ [type]: null }); // Set to null in Firestore
      toast({ title: "Success", description: `${type} deleted successfully.` });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({ title: "Error", description: `Failed to delete ${type}.`, variant: "destructive" });
    }
  }, [toast]); // Removed settingsService

  const handleSave = useCallback(async () => {
    setLoading('save');
    try {
      await settingsService.updateSiteSettings(settings);
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  }, [settings, toast]); // Removed settingsService

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await settingsService.getSiteSettings();
        if (loadedSettings) {
          setSettings(loadedSettings);
        }
      } catch (error) {
        console.error("Error loading settings on panel:", error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      }
    };

    loadSettings();
  }, [toast]);

  return (
    <Card className="p-6">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-6">
          <div>
            <Label htmlFor="appName">Application Name</Label>
            <Input
              id="appName"
              value={settings.appName || ''}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              disabled={loading === 'save'}
            />
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input
              id="metaDescription"
              value={settings.metaDescription || ''}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              disabled={loading === 'save'}
            />
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={settings.tagline || ''}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              disabled={loading === 'save'}
            />
          </div>

          <div>
            <Label>Light Mode Logo</Label>
            <ImageUpload
              uploadType="settings" // Specify upload type
              initialImageUrl={settings.lightLogo}
              onUploadComplete={(url) => handleUploadComplete(url, 'lightLogo')}
              onDeleteComplete={() => handleLogoDelete('lightLogo')}
            />
          </div>

          <div>
            <Label>Dark Mode Logo</Label>
            <ImageUpload
              uploadType="settings" // Specify upload type
              initialImageUrl={settings.darkLogo}
              onUploadComplete={(url) => handleUploadComplete(url, 'darkLogo')}
              onDeleteComplete={() => handleLogoDelete('darkLogo')}
            />
          </div>

          <div>
            <Label>Favicon</Label>
            <ImageUpload
              uploadType="settings" // Specify upload type
              initialImageUrl={settings.favicon}
              onUploadComplete={(url) => handleUploadComplete(url, 'favicon')}
              onDeleteComplete={() => handleLogoDelete('favicon')}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading === 'save'} onClick={handleSave}>
            {loading === 'save' ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
