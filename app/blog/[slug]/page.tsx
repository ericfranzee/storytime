import React from 'react';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { initializeApp, getApps } from 'firebase/app';
import parse from 'html-react-parser'; // To safely parse HTML content
import Image from 'next/image'; // Import Image component

// Firebase config - needed for server-side access
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
  content: string; // HTML content from Quill
  slug: string;
  featuredImageUrl?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  // Add category, tags if needed
}

interface PageProps {
  params: { slug: string };
}

async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Correct collection name to 'blog' to match admin panel
    const postsCollection = collection(db, 'blog'); 
    const q = query(postsCollection, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // No post found with this slug
    }

    // Assuming slugs are unique, take the first match
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;

  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null; // Return null on error
  }
}

// Generate Metadata dynamically
export async function generateMetadata({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Storytime Blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''), // Basic description from content
    openGraph: {
       title: post.title,
       description: post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
       images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    },
     twitter: {
       card: 'summary_large_image',
       title: post.title,
       description: post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
       images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
     },
  };
}


// React Server Component for displaying a single post
export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound(); // Trigger Next.js 404 page
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        {post.featuredImageUrl && (
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            width={1200}
            height={600}
            className="mb-8 rounded-lg object-cover w-full"
            style={{ objectFit: 'cover' }} // Add inline style for object-fit
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-500 text-sm mb-4">
          Published on {post.createdAt.toDate().toLocaleDateString()}
        </div>
        {parse(post.content)}
      </article>
    </div>
  );
}
