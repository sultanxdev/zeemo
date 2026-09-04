'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { fetchApi } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>('/v1/incidents')
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load incidents', err);
        setLoading(false);
      });
  }, []);

  const filtered = incidents.filter((inc) => {
    const matchSearch =
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.service.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'ALL' || inc.severity === severityFilter.toLowerCase();
    const matchStatus = statusFilter === 'ALL' || inc.status === statusFilter.toLowerCase();
    return matchSearch && matchSeverity && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Incidents
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Track, investigate, and remediate production incidents across your architecture
          </p>
        </div>
        <Link href="/incidents/new">
          <Button size="sm" className="gap-1.5 font-medium text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>New Incident</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card/40">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by title, service, error code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/80 border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Severity selector */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-background/80 border border-border rounded-md px-2.5 py-1.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          >
            <option value="ALL">Severity: All</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background/80 border border-border rounded-md px-2.5 py-1.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          >
            <option value="ALL">Status: All</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="WAITING_APPROVAL">Waiting Approval</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-lg border border-border bg-card/40 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-secondary/40 text-muted-foreground font-mono border-b border-border">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Incident Title</th>
              <th className="py-3 px-3">Service</th>
              <th className="py-3 px-3">Severity</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Confidence</th>
              <th className="py-3 px-4 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-muted-foreground font-mono">
                  Loading incidents...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground font-mono">
                  No matching incidents found.
                </td>
              </tr>
            ) : (
              filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-secondary/30 transition-colors group">
                  <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">
                    INC-{inc.id.slice(0, 6)}
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/incidents/${inc.id}`} className="block">
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {inc.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-md mt-0.5">
                        {inc.description}
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded text-[11px]">
                      {inc.service}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        inc.severity === 'critical'
                          ? 'critical'
                          : inc.severity === 'high'
                          ? 'high'
                          : 'medium'
                      }
                    >
                      {inc.severity.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        inc.status === 'resolved'
                          ? 'success'
                          : inc.status === 'waiting_approval'
                          ? 'high'
                          : 'outline'
                      }
                    >
                      {inc.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {inc.confidence ? (
                      <span className="text-white font-semibold">{Math.round(inc.confidence * 100)}%</span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground text-[11px]">
                    {formatTimestamp(inc.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
