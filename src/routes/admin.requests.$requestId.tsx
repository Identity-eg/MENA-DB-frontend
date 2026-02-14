import { createFileRoute } from '@tanstack/react-router'
import { Send, MessageCircle, Upload } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PageHeader } from '@/components/page-header'
import { RequestStepper } from '@/components/RequestStepper'
import { SubjectsTable } from '@/components/SubjectsTable'
import { CommentsThread } from '@/components/CommentsThread'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockRequests } from '@/data/mock-requests'

export const Route = createFileRoute('/admin/requests/$requestId')({
  component: AdminRequestDetailPage,
})

function AdminRequestDetailPage() {
  const { requestId } = Route.useParams()
  const request = mockRequests.find((r) => r.id === requestId)

  if (!request) {
    return (
      <DashboardLayout variant="admin">
        <div className="rounded-xl border border-border bg-muted/20 px-6 py-12 text-center text-muted-foreground">
          Request not found.
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout variant="admin">
      <PageHeader
        title={`Request ${request.id}`}
        requestId={request.id}
        status={request.status}
        createdAt={request.createdAt}
      />
      <div className="mt-8 space-y-8">
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Workflow
          </h2>
          <RequestStepper status={request.status} />
        </section>
        <section>
          <SubjectsTable subjects={request.subjects} readonly />
        </section>

        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30">
            <CardTitle className="text-base font-medium">
              Evaluation panel
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Set final price and TAT per service, then send quotation or
              request clarification.
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {request.services.map((svc) => (
                <div
                  key={svc.id}
                  className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-muted/20 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {svc.serviceName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Est. ${svc.estimatedPriceUsd} · {svc.estimatedTatDays}{' '}
                      days
                    </p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={svc.included}
                      className="rounded border-input"
                    />
                    <span className="text-sm text-muted-foreground">
                      Include
                    </span>
                  </label>
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Final price (USD)
                      </Label>
                      <Input
                        type="number"
                        defaultValue={
                          svc.finalPriceUsd ?? svc.estimatedPriceUsd
                        }
                        className="w-24"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Final TAT (days)
                      </Label>
                      <Input
                        type="number"
                        defaultValue={svc.finalTatDays ?? svc.estimatedTatDays}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-4">
                <p className="font-medium text-foreground">
                  Total: ${request.totalPriceUsd}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Request Clarification
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Send className="h-4 w-4" />
                    Send Quotation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30">
            <CardTitle className="text-base font-medium">
              Deliverables
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload PDF per service and mark completed.
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {request.services.map((svc) => (
                <div
                  key={svc.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4"
                >
                  <p className="font-medium text-foreground">
                    {svc.serviceName}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload PDF
                    </Button>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        defaultChecked={svc.status === 'completed'}
                        className="rounded border-input"
                      />
                      Completed
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section>
          <CommentsThread
            comments={request.comments ?? []}
            onSend={(body) => {}}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}
