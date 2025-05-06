"use client";
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from 'next/image';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { motion } from 'framer-motion';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    featuredImageUrl?: string;
    createdAt: Timestamp;
}

const BlogSection = () => {
    async function getBlogPosts(): Promise<BlogPost[]> {
        try {
            const db = getFirestore();
            const postsCollection = collection(db, 'blog');
            const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(postsQuery);
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as BlogPost[];
            return postsData.slice(0, 3); // Limit to 3 posts
        } catch (error) {
            console.error("Error fetching blog posts for homepage:", error);
            return [];
        }
    }

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            setIsLoading(true);
            const fetchedPosts = await getBlogPosts();
            setPosts(fetchedPosts);
            setIsLoading(false);
        };

        loadPosts();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { y: -8, transition: { duration: 0.2 } }
    };

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Latest Insights
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover the latest trends and tips in AI-powered storytelling
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="relative w-20 h-20">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full animate-ping" />
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                ) : posts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No blog posts found.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <Link href={`/blog/${post.slug}`} className="block h-full">
                                    <Card className="h-full group relative bg-white dark:bg-gray-800 overflow-hidden">
                                        {post.featuredImageUrl && (
                                            <div className="relative w-full h-56 overflow-hidden">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="h-full"
                                                >
                                                    <Image
                                                        src={post.featuredImageUrl}
                                                        alt={post.title}
                                                        fill
                                                        objectFit="cover"
                                                        className="transition-transform duration-300"
                                                    />
                                                </motion.div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-xl font-bold group-hover:text-blue-500 transition-colors">
                                                {post.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(post.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter className="flex justify-between items-center">
                                            <span className="text-blue-500 font-medium group-hover:underline">
                                                Read More
                                            </span>
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                className="text-blue-500"
                                            >
                                                →
                                            </motion.div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mt-12 text-center"
                >
                    <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                        View All Posts
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default BlogSection;
