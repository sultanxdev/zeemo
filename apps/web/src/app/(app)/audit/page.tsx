'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchApi } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';
import { ScrollText, ShieldCheck, User } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>('/v1/audit-logs')
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Immutable Audit Trail
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          Cryptographically auditable log of all incident creations, agent investigations, and approval decisions
        </p>
      </div>

      <Card className="bg-card/40">
        <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-blue-400" />
            <span>Audit Events ({logs.length})</span>
          </CardTitle>
          <Badge variant="outline" className="font-mono text-[10px]">
            TAMPER-EVIDENT RECORD
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/30 text-muted-foreground font-mono border-b border-border">
              <tr>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-4">Metadata Details</th>
                <th className="py-2.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Loading audit events...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/20">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-400">{log.action}</span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{log.entityType}</td>
                    <td className="py-3 px-3 text-white">
                      {log.userId ? 'Alex Rivera (SRE)' : 'System / Orchestrator'}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {JSON.stringify(log.metadata)}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">
                      {formatTimestamp(log.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
