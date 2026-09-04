'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShieldCheck, Plus, Terminal, Search, Bell } from 'lucide-react';

interface NavbarProps {
  onNewIncident?: () => void;
}

export function Navbar({ onNewIncident }: NavbarProps) {
  return (
    <header className="h-14 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
      {/* Workspace Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-secondary/40">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-white">Acme Core Engineering</span>
          <span className="text-muted-foreground/60 text-xs">/</span>
          <span className="text-xs text-muted-foreground font-mono">checkout-cluster</span>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">
          production
        </Badge>
      </div>

      {/* Center Search / CmdK */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background/80 text-muted-foreground text-xs w-72 justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Search incidents, logs, code...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono border border-border">⌘K</kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Gemini 3.8 Flash</span>
        </div>

        <Link href="/incidents/new">
          <Button size="sm" className="gap-1.5 font-medium shadow-sm shadow-blue-500/20">
            <Plus className="h-3.5 w-3.5" />
            <span>New Incident</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
