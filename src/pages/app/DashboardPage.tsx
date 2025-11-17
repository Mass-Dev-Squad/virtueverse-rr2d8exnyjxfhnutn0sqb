import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import type { Deed } from '@shared/types';
import { format } from 'date-fns';
import { Leaf, Star, Clock, PlusCircle, ChevronsRight } from 'lucide-react';
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
export default function DashboardPage() {
  const user = useAuth(s => s.user);
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      api<Deed[]>(`/api/deeds/${user.id}`)
        .then(setDeeds)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [user]);
  const recentDeeds = deeds.slice(0, 3);
  const getStatusVariant = (status: Deed['status']) => {
    switch (status) {
      case 'verified': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="space-y-8">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's a summary of your good deeds.</p>
        </motion.header>
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}><StatCard title="Virtue Points" value={user?.credits ?? 0} icon={<Star className="text-amber-500" />} /></motion.div>
          <motion.div variants={itemVariants}><StatCard title="Deeds Submitted" value={deeds.length} icon={<Leaf className="text-emerald-500" />} /></motion.div>
          <motion.div variants={itemVariants}><StatCard title="Pending Review" value={deeds.filter(d => d.status === 'pending').length} icon={<Clock className="text-blue-500" />} /></motion.div>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Deeds</CardTitle>
                <CardDescription>Your latest acts of kindness.</CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/app/deeds">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : recentDeeds.length > 0 ? (
                <motion.ul className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {recentDeeds.map(deed => (
                    <motion.li key={deed.id} variants={itemVariants} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-semibold">{deed.deedType}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(deed.createdAt), 'PPP')}</p>
                      </div>
                      <Badge variant={getStatusVariant(deed.status)}>{deed.status}</Badge>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">You haven't submitted any deeds yet.</p>
                  <Button asChild>
                    <Link to="/app/deeds">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Submit Your First Deed
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-emerald-800 dark:text-emerald-200">Ready for another good deed?</CardTitle>
              <CardDescription className="text-emerald-700 dark:text-emerald-300">Browse our catalog of ideas and make a difference today.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link to="/app/deeds">
                  Submit a New Deed <ChevronsRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);