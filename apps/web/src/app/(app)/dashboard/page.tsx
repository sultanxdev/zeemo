'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
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

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Engineering SRE Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Autonomous multi-agent investigation & active incident response summary
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/incidents/new">
            <Button size="sm" className="font-medium text-xs">
              + New Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Investigations</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">42</div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <TrendingUp className="h-3 w-3" /> +8 this week
            </span>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Resolved</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">35</div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[10px] text-muted-foreground font-mono">83.3% resolution rate</span>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">In Progress</span>
            <div className="text-2xl font-bold text-blue-400 font-mono mt-1">4</div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[10px] text-muted-foreground font-mono">Orchestrator active</span>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Needs Review</span>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-1">3</div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[10px] text-amber-400 font-mono">Awaiting approval</span>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Avg Investigation</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">11.4m</div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[10px] text-emerald-400 font-mono">-4.2m vs manual triage</span>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Avg AI Cost</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">$0.08</div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[10px] text-muted-foreground font-mono">Gemini 3.8 Flash</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Incidents & AI Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Active & Recent Incidents
            </h2>
            <Link href="/incidents" className="text-xs text-blue-400 hover:underline font-mono">
              View all incidents →
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-card/40 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 text-muted-foreground font-mono border-b border-border">
                <tr>
                  <th className="py-2.5 px-4">Incident</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground font-mono">
                      Loading incidents...
                    </td>
                  </tr>
                ) : incidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground font-mono">
                      No incidents logged yet.
                    </td>
                  </tr>
                ) : (
                  incidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-secondary/30 transition-colors group">
                      <td className="py-3 px-4">
                        <Link href={`/incidents/${inc.id}`} className="block">
                          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {inc.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-sm mt-0.5">
                            {inc.description}
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded text-[11px]">
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

        {/* AI Performance Card (1 col) */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            AI Engineering Reliability
          </h2>

          <Card className="bg-card/40 border-border">
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Benchmark Metrics</span>
                <Badge variant="outline" className="font-mono text-[10px]">52 EVAL CASES</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted-foreground">Root Cause Accuracy</span>
                  <span className="text-white font-semibold">88.5%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '88.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted-foreground">Evidence Precision</span>
                  <span className="text-white font-semibold">92.4%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted-foreground">Citation Correctness</span>
                  <span className="text-white font-semibold">96.1%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '96.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted-foreground">Tool Selection</span>
                  <span className="text-white font-semibold">94.0%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '94.0%' }} />
                </div>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded bg-secondary/30 border border-border">
                  <div className="text-[10px] font-mono text-muted-foreground">P50 LATENCY</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">7.6s</div>
                </div>
                <div className="p-2.5 rounded bg-secondary/30 border border-border">
                  <div className="text-[10px] font-mono text-muted-foreground">HALLUCINATION</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">3.8%</div>
                </div>
              </div>

              <Link href="/evaluations">
                <Button variant="outline" size="sm" className="w-full text-xs font-mono mt-2">
                  View Full Evaluation Suite →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
