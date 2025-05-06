import { db, storage, STORAGE_PATHS } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface SiteSettings {
  appName?: string;
  metaDescription?: string;
  tagline?: string;
  lightLogo?: string;
  darkLogo?: string;
  favicon?: string; // Keep favicon
  // Remove logoUrl and faviconUrl
}

const SETTINGS_DOC_ID = 'general'; // Document ID is 'general'
const SETTINGS_COLLECTION_NAME = 'settings'; // Collection name is 'settings'

export const settingsService = {
  /**
   * Fetches the site settings from Firestore (using 'settings' collection).
   */
  async getSiteSettings(): Promise<SiteSettings | null> { // Return type is now SiteSettings
    try {
      const settingsRef = doc(db, SETTINGS_COLLECTION_NAME, SETTINGS_DOC_ID); // Use collection name constant
      const docSnap = await getDoc(settingsRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings; // Type cast to SiteSettings
      } else {
        console.log("No site settings document found!");
        return null;
      }
    } catch (error) {
      console.error("Error getting site settings:", error);
      throw error;
    }
  },

  /**
   * Updates the site settings in Firestore ('settings' collection, 'general' doc).
   */
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> { // Parameter type is Partial<SiteSettings>
    try {
      const settingsRef = doc(db, SETTINGS_COLLECTION_NAME, SETTINGS_DOC_ID); // Use collection name constant
      await setDoc(settingsRef, settings, { merge: true });
    } catch (error) {
      console.error("Error updating site settings:", error);
      throw error;
    }
  },

  /**
   * Uploads an image for site settings (logo or favicon) to SETTINGS_IMAGES path.
   */
  async uploadSettingsImage(file: File, type: 'lightLogo' | 'darkLogo' | 'favicon'): Promise<string | null> {
    try {
      const path = STORAGE_PATHS.SETTINGS_IMAGES; // All settings images go to SETTINGS_IMAGES
      const safeFileName = `${type}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${path}/${safeFileName}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      return downloadUrl;
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      return null; // Return null in case of error
    }
  }
};
