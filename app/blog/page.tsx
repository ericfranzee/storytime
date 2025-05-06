import React from 'react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image'; // Import Image
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { initializeApp, getApps } from 'firebase/app'; // Required for server-side Firebase access

// Firebase config - needed for server-side access
// Ensure these environment variables are available in your deployment environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase Admin App (or reuse existing one) for server-side
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImageUrl?: string;
  createdAt: Timestamp;
  // Add a snippet or excerpt field if you store one
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Correct collection name to 'blog' to match admin panel
    const postsCollection = collection(db, 'blog');
    const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(postsQuery);
    const postsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];
    return postsData;
  } catch (error) {
    console.error("Error fetching blog posts for public page:", error);
    return []; // Return empty array on error
  }
}

// This is a React Server Component (RSC)
export default async function BlogListPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Blog</h1>
      
      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No blog posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} legacyBehavior>
              <a className="block group">
                <Card className="h-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  {post.featuredImageUrl && (
                    <div className="relative w-full h-48">
                      {/* Use next/image for optimized images */}
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        className="transition-transform duration-300 group-hover:scale-105 object-cover"
                        layout="fill" // Required for relative parent
                        objectFit="cover" // Maintain aspect ratio
                        key={post.id}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Add excerpt here if available */}
                    <CardDescription>
                       Published on {post.createdAt?.toDate().toLocaleDateString()}
                    </CardDescription>
                  </CardContent>
                   <CardFooter>
                     <span className="text-primary font-semibold group-hover:underline">Read More →</span>
                   </CardFooter>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Optional: Add metadata for the blog page
export const metadata = {
  title: 'Blog - Storytime',
  description: 'Read the latest articles and updates from Storytime.',
};
