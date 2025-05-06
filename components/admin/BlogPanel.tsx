"use client";

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, Timestamp, query, orderBy, getDoc } from 'firebase/firestore'; // Removed deleteDoc, added getDoc
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogService } from '@/lib/firebase/blog-service'; // Removed unused BlogServicePost alias
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/lib/toast-utils";
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'; // Corrected import
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react'; // Import icons
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  category?: string;
  slug: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  featuredImage?: string; // Add featuredImage field
  // Use the interface from the service, potentially extending if needed locally
}

const BlogPanel = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track deleting post ID
  const db = getFirestore();
  // Removed unused toast variable

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // Correct collection name to 'blog'
      const postsCollection = collection(db, 'blog'); 
      // Order by creation date, newest first
      const postsQuery = query(postsCollection, orderBy('createdAt', 'desc')); 
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[];
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      showToast.error("Fetch Error", "Could not load blog posts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [db, fetchPosts]); // Added fetchPosts to dependency array

  const handleDelete = async (post: BlogPost) => { // Pass the whole post object
    setIsDeleting(post.id);
    try {
      // Use the centralized blog service delete function
      await blogService.deletePost(post.id, post.featuredImage); // Pass ID and image URL
      showToast.success("Post Deleted", `"${post.title}" removed successfully.`);
      // Refresh the list after deletion
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast.error("Delete Error", `Failed to delete blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleNewPost = () => {
    router.push('/panel?tab=new-post', { scroll: false });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Blog Posts</h2>
        <Button onClick={handleNewPost}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No blog posts found.</TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category || "Uncategorized"}</TableCell>
                  <TableCell>{post.createdAt?.toDate().toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                     <Link href={`/blog/${post.slug}`} target="_blank">
                       <Button variant="outline" size="icon" title="View Post">
                         <Eye className="h-4 w-4" />
                       </Button>
                     </Link>
                     <Link href={`/panel/blog/edit/${post.id}`}>
                       <Button variant="outline" size="icon" title="Edit Post">
                         <Edit className="h-4 w-4" />
                       </Button>
                     </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" title="Delete Post" disabled={isDeleting === post.id}>
                           {isDeleting === post.id ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the blog post titled "{post.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          {/* Pass the post object to handleDelete */}
                          <AlertDialogAction onClick={() => handleDelete(post)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default BlogPanel;
