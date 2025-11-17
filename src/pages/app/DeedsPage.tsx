import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import type { DeedCatalogItem, Deed } from '@shared/types';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
const MotionCard = motion(Card);
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};
export default function DeedsPage() {
  const [catalog, setCatalog] = useState<DeedCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeed, setSelectedDeed] = useState<DeedCatalogItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuth(s => s.user);
  useEffect(() => {
    setIsLoading(true);
    api<DeedCatalogItem[]>('/api/deeds/catalog')
      .then(setCatalog)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !selectedDeed) return;
    const formData = new FormData(e.currentTarget);
    const description = formData.get('description') as string;
    const proofUrl = formData.get('proofUrl') as string;
    setIsSubmitting(true);
    try {
      await api<Deed>('/api/deeds', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          deedType: selectedDeed.title,
          description,
          proofUrl,
        }),
      });
      toast.success('Deed submitted successfully!', { description: 'It is now pending verification.' });
      setSelectedDeed(null);
    } catch (error) {
      toast.error('Failed to submit deed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Submit a Good Deed</h1>
        <p className="text-muted-foreground">Choose from our catalog of deeds or suggest your own.</p>
      </header>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {catalog.map(deed => (
            <MotionCard
              key={deed.id}
              variants={itemVariants}
              className="flex flex-col"
              whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CardHeader>
                <img src={deed.illustrationUrl} alt="" className="w-full h-32 object-contain mb-4" />
                <CardTitle>{deed.title}</CardTitle>
                <CardDescription>{deed.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{deed.creditValue}</span> Virtue Points
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setSelectedDeed(deed)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> I did this!
                </Button>
              </CardFooter>
            </MotionCard>
          ))}
        </motion.div>
      )}
      <Dialog open={!!selectedDeed} onOpenChange={() => setSelectedDeed(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit: {selectedDeed?.title}</DialogTitle>
            <DialogDescription>
              That's awesome! Please provide a few more details to get your deed verified.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea id="description" name="description" placeholder="e.g., I helped Mrs. Smith carry her groceries upstairs." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proofUrl">Proof (Link)</Label>
                <Input id="proofUrl" name="proofUrl" type="url" placeholder="https://example.com/photo.jpg" required />
                <p className="text-xs text-muted-foreground">A link to a photo, screenshot, or other verification.</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSelectedDeed(null)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}