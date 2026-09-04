'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { fetchApi } from '@/lib/api';
import { ArrowLeft, Cpu, AlertTriangle, Sparkles } from 'lucide-react';

export default function NewIncidentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: 'Payment Gateway 504 Gateway Timeout Spike',
    description: 'Payment gateway API error rate spiked to 28% following deployment v1.8.2. Upstream latency increased above 5000ms.',
    service: 'payment-service',
    environment: 'production',
    severity: 'critical',
    additionalContext: 'First alert triggered by Datadog at 10:45 UTC. Customers report delayed transaction authorizations.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create incident
      const incident = await fetchApi<any>('/v1/incidents', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      // 2. Trigger investigation run
      await fetchApi<any>(`/v1/incidents/${incident.id}/investigate`, {
        method: 'POST',
      });

      // 3. Redirect to incident detail page
      router.push(`/incidents/${incident.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create and investigate incident');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/incidents">
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Incidents
          </Button>
        </Link>
      </div>

      <Card className="bg-card/60 border-border shadow-md">
        <CardHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono mb-1">
            <Cpu className="h-4 w-4" />
            <span>ORCHESTRATOR DISPATCH</span>
          </div>
          <CardTitle className="text-xl font-bold text-white">
            Create Incident & Trigger Investigation
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Provide incident symptoms. Zeemo&apos;s orchestrator and specialist agents will immediately inspect telemetry, code diffs, and runbooks.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-md border border-red-500/40 bg-red-950/20 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white">Incident Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Service & Environment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white">Affected Service *</label>
                <input
                  type="text"
                  required
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white">Environment</label>
                <select
                  value={form.environment}
                  onChange={(e) => setForm({ ...form, environment: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="production">production</option>
                  <option value="staging">staging</option>
                  <option value="preview">preview</option>
                </select>
              </div>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white">Severity Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(['critical', 'high', 'medium', 'low'] as const).map((sev) => (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => setForm({ ...form, severity: sev })}
                    className={`py-2 text-xs font-mono font-bold rounded-md border transition-all ${
                      form.severity === sev
                        ? sev === 'critical'
                          ? 'border-red-500 bg-red-950/40 text-red-400'
                          : sev === 'high'
                          ? 'border-amber-500 bg-amber-950/40 text-amber-400'
                          : 'border-blue-500 bg-blue-950/40 text-blue-400'
                        : 'border-border bg-background text-muted-foreground hover:text-white'
                    }`}
                  >
                    {sev.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white">Incident Description *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Additional Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white">Additional Context & Deploy Info</label>
              <textarea
                rows={2}
                value={form.additionalContext}
                onChange={(e) => setForm({ ...form, additionalContext: e.target.value })}
                placeholder="Recent deploy tags, commit hashes, or customer impact notes..."
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </CardContent>

          <CardFooter className="p-6 border-t border-border bg-card/30 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              RabbitMQ Queue: <code className="text-blue-400">zeemo.investigations</code>
            </span>
            <Button type="submit" disabled={loading} className="gap-2 text-xs font-semibold px-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{loading ? 'Dispatching...' : 'Start Investigation'}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
