'use client';

import React, { useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
// Removed unused Checkbox import
import type { FC } from 'react';
import { motion } from 'framer-motion';

const SupportPage: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailNotify, setEmailNotify] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message, emailNotify }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully!",
        });
        setName('');
        setEmail('');
        setMessage('');
        setEmailNotify(false);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 prose prose-gray dark:prose-invert max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
          <p className="text-gray-600 dark:text-gray-300">
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello,
            feel free to reach out using the form below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold">Contact Information</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our friendly team is always here to help.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Email:</p>
              <p className="text-blue-500">storytime@ericfranzee.com</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Address:</p>
              <p className="text-gray-600 dark:text-gray-300">Wing D, Second Floor, Reinsurrance Building, Beside BOI, Central Business Area, Abuja.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Phone:</p>
              <p className="text-gray-600 dark:text-gray-300">+234 (0)810-055-1172</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

            
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SupportPage;
