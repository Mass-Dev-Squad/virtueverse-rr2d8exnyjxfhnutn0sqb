import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import type { Deed } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ShieldAlert, Inbox } from 'lucide-react';
type PendingDeed = Deed & { userName: string };
export default function AdminVerificationPage() {
  const [pendingDeeds, setPendingDeeds] = useState<PendingDeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const user = useAuth(s => s.user);
  const navigate = useNavigate();
  const fetchPendingDeeds = useCallback(async () => {
    setIsLoading(true);
    try {
      const deeds = await api<PendingDeed[]>('/api/admin/deeds/pending');
      setPendingDeeds(deeds);
    } catch (error) {
      toast.error('Failed to fetch pending deeds.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/app/dashboard');
      return;
    }
    fetchPendingDeeds();
  }, [user, navigate, fetchPendingDeeds]);
  const handleVerification = async (deedId: string, status: 'verified' | 'rejected') => {
    setIsProcessing(prev => ({ ...prev, [deedId]: true }));
    try {
      await api('/api/admin/deeds/verify', {
        method: 'POST',
        body: JSON.stringify({ deedId, status }),
      });
      toast.success(`Deed has been ${status}.`);
      setPendingDeeds(prev => prev.filter(deed => deed.id !== deedId));
    } catch (error) {
      toast.error(`Failed to ${status} deed.`);
      console.error(error);
    } finally {
      setIsProcessing(prev => ({ ...prev, [deedId]: false }));
    }
  };
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Deed Verification</h1>
        <p className="text-muted-foreground">Review and approve or reject pending good deeds.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>
            There are currently {pendingDeeds.length} deed(s) awaiting review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : pendingDeeds.length === 0 ? (
            <div className="text-center py-16">
              <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">All caught up!</h3>
              <p className="mt-1 text-sm text-muted-foreground">There are no pending deeds to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Deed</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDeeds.map((deed) => (
                    <TableRow key={deed.id}>
                      <TableCell className="font-medium">{deed.userName}</TableCell>
                      <TableCell>
                        <p className="font-semibold">{deed.deedType}</p>
                        <p className="text-sm text-muted-foreground">{deed.description}</p>
                      </TableCell>
                      <TableCell>{formatDistanceToNow(new Date(deed.createdAt), { addSuffix: true })}</TableCell>
                      <TableCell>
                        <a href={deed.proofUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                          View Proof
                        </a>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleVerification(deed.id, 'rejected')}
                          disabled={isProcessing[deed.id]}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleVerification(deed.id, 'verified')}
                          disabled={isProcessing[deed.id]}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}