import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Eye } from 'lucide-react'
import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PageHeader } from '@/components/page-header'
import { StatusPill } from '@/components/StatusPill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockRequests } from '@/data/mock-requests'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/requests/')({
  component: AdminRequestsPage,
})

function AdminRequestsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const filtered = mockRequests.filter((r) => {
    const matchSearch =
      !search || r.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <DashboardLayout variant="admin">
      <PageHeader
        title="Requests queue"
        subtitle={`${filtered.length} requests`}
      />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by request ID"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={cn(
            'h-9 rounded-lg border border-input bg-background px-3 text-sm',
          )}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="WaitingForEvaluation">Waiting for evaluation</option>
          <option value="WaitingForPayment">Waiting for payment</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Request ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Customer email
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Subjects
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Services
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Submitted
                </th>
                <th className="px-4 py-3 text-right font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {r.id}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.customerEmail}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.subjects.length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.services.slice(0, 2).map((s) => (
                        <span
                          key={s.id}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {s.serviceName.split(' ')[0]}
                        </span>
                      ))}
                      {r.services.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{r.services.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    ${r.totalPriceUsd}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to="/admin/requests/$requestId"
                        params={{ requestId: r.id }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Open
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
