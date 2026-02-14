import {
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Unlock,
} from 'lucide-react'

import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'

const items = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Requests', href: '/requests', icon: FileText },
  { label: 'Companies', href: '/companies', icon: Building2 },
  { label: 'Unlocks', href: '/unlocks', icon: Unlock },
]

export function DashboardSidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <ShieldCheck className="size-6 text-primary" />
          <span className="font-semibold tracking-tight">CompliancePortal</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 text-muted-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
              activeProps={{
                className: 'bg-accent text-primary hover:text-primary',
              }}
              data-testid={`nav-link-${item.label.toLowerCase()}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4">
          <Link to="/">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}
