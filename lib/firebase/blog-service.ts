import { db, storage, STORAGE_PATHS } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';


export { STORAGE_PATHS };

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  featuredImageUrl?: string;
  category: string;
  tags: string[];
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const blogService = {
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },

  async createPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'blog'), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async updatePost(postId: string, data: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const postRef = doc(db, 'blog', postId);
      await updateDoc(postRef, {
        ...data,
        updatedAt: new Date() // Always update the timestamp
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  async getPost(postId: string): Promise<BlogPost | null> {
    try {
      const postRef = doc(db, 'blog', postId);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert Firestore Timestamps to JS Dates
        return {
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate() : new Date(),
          updatedAt: (data.updatedAt as any)?.toDate ? (data.updatedAt as any).toDate() : new Date(),
        } as BlogPost;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  },

  async deletePost(postId: string, imageUrl?: string): Promise<void> {
    try {
      // 1. Delete the Firestore document
      const postRef = doc(db, 'blog', postId);
      await deleteDoc(postRef); // Use deleteDoc from 'firebase/firestore'
      console.log(`Deleted Firestore document for post: ${postId}`);

      // 2. If an image URL exists, attempt to delete it from Blob storage
      if (imageUrl) {
        console.log(`Attempting to delete blob image: ${imageUrl}`);
        try {
          // Call the Vercel Blob delete API route
          const response = await fetch('/api/upload/delete', { // Assuming this is your delete route
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: imageUrl }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Handle non-JSON response
            // Log the error but don't throw, as the Firestore doc is already deleted
            console.error(`Failed to delete blob image ${imageUrl}: ${response.status}`, errorData.error || 'Unknown error');
            // Optionally, you could re-throw or handle this more robustly
          } else {
            console.log(`Successfully deleted blob image: ${imageUrl}`);
          }
        } catch (blobError) {
          console.error(`Error calling blob delete API for ${imageUrl}:`, blobError);
          // Log the error but continue
        }
      }
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error);
      throw error; // Re-throw the error for the caller to handle
    }
  },

  // Add other functions like getAllPosts etc. as needed
};
