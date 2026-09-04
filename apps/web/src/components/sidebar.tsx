'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  AlertTriangle,
  PlayCircle,
  FileText,
  Database,
  GitBranch,
  Activity,
  Cloud,
  CheckCircle2,
  FileCheck2,
  ScrollText,
  Users,
  KeyRound,
  Settings,
  BarChart3,
  Cpu,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'INVESTIGATE',
    items: [
      { title: 'Incidents', href: '/incidents', icon: AlertTriangle, badge: '1 Active' },
      { title: 'Agent Runs', href: '/runs', icon: PlayCircle },
    ],
  },
  {
    title: 'KNOWLEDGE',
    items: [
      { title: 'Documents', href: '/knowledge', icon: FileText },
      { title: 'Sources', href: '/knowledge/sources', icon: Database },
    ],
  },
  {
    title: 'INTEGRATIONS',
    items: [
      { title: 'GitHub', href: '/integrations/github', icon: GitBranch },
      { title: 'Observability', href: '/integrations/observability', icon: Activity },
      { title: 'AWS Cloud', href: '/integrations/aws', icon: Cloud },
    ],
  },
  {
    title: 'AI',
    items: [
      { title: 'Evaluations', href: '/evaluations', icon: CheckCircle2, badge: '88.5%' },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      { title: 'Approvals', href: '/approvals', icon: FileCheck2, badge: '1 Pending' },
      { title: 'Audit Logs', href: '/audit', icon: ScrollText },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      { title: 'Team', href: '/workspace/team', icon: Users },
      { title: 'API Keys', href: '/workspace/keys', icon: KeyRound },
      { title: 'Settings', href: '/workspace/settings', icon: Settings },
      { title: 'Usage & Cost', href: '/workspace/usage', icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-card/60 backdrop-blur-md border-r border-border flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-5 border-b border-border gap-2.5">
        <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Cpu className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-wider text-sm text-white flex items-center gap-1.5 font-mono">
            ZEEMO
            <span className="text-[10px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 font-normal">
              v1.0
            </span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">AI Incident SRE</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h4 className="px-2 text-[10px] font-semibold text-muted-foreground/70 tracking-wider font-mono">
              {section.title}
            </h4>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-all group',
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                        : 'text-muted-foreground hover:text-white hover:bg-secondary/60'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={cn(
                          'h-3.5 w-3.5 transition-colors',
                          isActive ? 'text-blue-400' : 'text-muted-foreground group-hover:text-white'
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded font-mono',
                          item.badge.includes('Pending') || item.badge.includes('Active')
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-secondary text-muted-foreground'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Workspace Profile Footer */}
      <div className="p-3 border-t border-border bg-card/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white font-mono shrink-0">
            AR
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-medium text-white truncate">Alex Rivera</span>
            <span className="text-[10px] text-muted-foreground truncate font-mono">alex.sre@acme.corp</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
