'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';
import { FileText, Search, Plus, Database, Sparkles, CheckCircle2 } from 'lucide-react';

export default function KnowledgePage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchApi<any[]>('/v1/knowledge/documents')
      .then((data) => {
        setDocs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await fetchApi<any[]>('/v1/knowledge/search', {
        method: 'POST',
        body: JSON.stringify({ query: searchQuery, service: 'checkout-service' }),
      });
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Engineering Knowledge Base
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Hybrid RAG index over runbooks, architecture docs, and postmortems (PostgreSQL + pgvector)
          </p>
        </div>
      </div>

      {/* Hybrid Retrieval Test Box */}
      <Card className="bg-card/40 border-border">
        <CardHeader className="p-4 border-b border-border">
          <CardTitle className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Test Hybrid Retrieval Engine (BM25 + Dense Vector + Metadata Filter)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query runbooks e.g. 'PostgreSQL connection pool exhaustion'..."
                className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" size="sm" disabled={searching} className="text-xs font-mono">
              {searching ? 'Querying...' : 'Hybrid Search'}
            </Button>
          </form>

          {searchResults && (
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-[11px] font-mono text-muted-foreground">Retrieved Candidates:</span>
              {searchResults.map((res: any, idx: number) => (
                <div key={idx} className="p-3 rounded border border-border bg-secondary/30 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{res.document.name}</span>
                    <Badge variant="success">{Math.round(res.score * 100)}% Similarity</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] font-mono">{res.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Indexed Documents Table */}
      <Card className="bg-card/40">
        <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-400" />
            <span>Indexed Engineering Documents</span>
          </CardTitle>
          <Badge variant="outline" className="font-mono text-[10px]">
            PGVECTOR ACTIVE
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/30 text-muted-foreground font-mono border-b border-border">
              <tr>
                <th className="py-2.5 px-4">Document Title</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Chunks</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Indexed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {docs.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-secondary/20">
                  <td className="py-3 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {doc.documentType}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{doc.service || 'global'}</td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{doc.chunkCount}</td>
                  <td className="py-3 px-3">
                    <Badge variant="success">INDEXED</Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground text-[11px]">
                    {formatTimestamp(doc.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
