import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { Trophy } from 'lucide-react';
interface LeaderboardEntry {
  id: string;
  name: string;
  credits: number;
}
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
  },
};
export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    api<LeaderboardEntry[]>('/api/leaderboard')
      .then(setLeaderboard)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);
  const getTrophyColor = (rank: number) => {
    if (rank === 0) return 'text-amber-400';
    if (rank === 1) return 'text-gray-400';
    if (rank === 2) return 'text-amber-600';
    return 'text-muted-foreground';
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Community Leaderboard</h1>
        <p className="text-muted-foreground">Celebrating our top contributors of kindness!</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Virtuous Members</CardTitle>
          <CardDescription>Points are awarded for verified good deeds.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead className="text-right">Virtue Points</TableHead>
                </TableRow>
              </TableHeader>
              <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                {leaderboard.map((user, index) => (
                  <motion.tr key={user.id} variants={itemVariants} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Trophy className={`w-5 h-5 ${getTrophyColor(index)}`} />
                        <span>{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">{user.credits}</TableCell>
                  </motion.tr>
                ))}
              </motion.tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}