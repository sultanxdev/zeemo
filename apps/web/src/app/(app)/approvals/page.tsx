'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';
import { ShieldAlert, Check, X, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadApprovals = () => {
    fetchApi<any[]>('/v1/approvals')
      .then((data) => {
        setApprovals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleDecision = async (id: string, decision: 'approve' | 'reject') => {
    setActionLoading(true);
    try {
      await fetchApi(`/v1/approvals/${id}/${decision}`, { method: 'POST' });
      loadApprovals();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Human-in-the-Loop Approvals
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          Authorize or reject sensitive production actions recommended by Zeemo agents
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-muted-foreground">
            Loading approval requests...
          </div>
        ) : approvals.length === 0 ? (
          <div className="py-16 text-center space-y-2 border border-border rounded-lg bg-card/20">
            <p className="text-white text-sm">No pending approvals.</p>
            <p className="text-xs text-muted-foreground">
              High-risk actions triggered during an investigation will pause here for authorization.
            </p>
          </div>
        ) : (
          approvals.map((app) => (
            <Card key={app.id} className="bg-card/40 border-border shadow-sm">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">{app.action}</span>
                      <Badge variant={app.riskLevel === 'HIGH' ? 'critical' : 'high'}>
                        {app.riskLevel} RISK
                      </Badge>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Requested {formatTimestamp(app.requestedAt)}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    app.status === 'approved'
                      ? 'success'
                      : app.status === 'pending'
                      ? 'high'
                      : 'destructive'
                  }
                >
                  {app.status.toUpperCase()}
                </Badge>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                <p className="text-white leading-relaxed">{app.reason}</p>

                <div className="p-3 rounded-md bg-background/80 border border-border/70 font-mono text-[11px] space-y-1">
                  <span className="text-muted-foreground uppercase text-[10px] block">
                    Execution Payload Arguments:
                  </span>
                  <pre className="text-blue-300 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(app.arguments, null, 2)}
                  </pre>
                </div>

                {app.status === 'pending' ? (
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <Link
                      href={`/incidents/11111111-1111-1111-1111-111111111111`}
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      Inspect Correlated Evidence →
                    </Link>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading}
                        onClick={() => handleDecision(app.id, 'reject')}
                        className="gap-1.5 text-xs text-muted-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        disabled={actionLoading}
                        onClick={() => handleDecision(app.id, 'approve')}
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Authorize & Execute
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                    Decision logged by {app.decidedBy || 'user'} at {formatTimestamp(app.decidedAt)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
