import { Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import {
  getRequestsQueryOptions,
  useGetRequests,
} from '@/apis/requests/get-requests'
import type { TRequest } from '@/types/request'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/StatusPill'

const RECENT_LIMIT = 5

function formatRequestId(id: number) {
  return `REQ-${String(id).padStart(6, '0')}`
}

function formatPrice(estimatedPrice: number, invoiceAmount?: number | null) {
  const amount = invoiceAmount ?? estimatedPrice
  return `$${amount}`
}

export function DashboardRecentRequests() {
  const { data } = useGetRequests()
  const allRequests: Array<TRequest> = data?.data ?? []
  const recentRequests = allRequests.slice(0, RECENT_LIMIT)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your most recently submitted compliance checks
          </p>
        </div>
        <Link to="/requests">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentRequests.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No requests yet. Create one from the requests page.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono font-medium">
                    {formatRequestId(req.id)}
                  </TableCell>
                  <TableCell>
                    {req.companies
                      .map((c) =>
                        c.nameAr ? `${c.nameEn} (${c.nameAr})` : c.nameEn,
                      )
                      .join(', ') || '—'}
                    {req.individuals?.length > 0 &&
                      ` · ${req.individuals?.length} individual${req.individuals?.length !== 1 ? 's' : ''}`}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={req.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(req.estimatedPrice, req.invoice?.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/requests/$requestId"
                      params={{ requestId: String(req.id) }}
                    >
                      <Button variant="ghost" size="icon">
                        <Eye size={16} />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
