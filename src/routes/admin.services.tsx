import { createFileRoute } from '@tanstack/react-router'
import { Pencil, ToggleLeft } from 'lucide-react'
import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { servicesCatalog } from '@/data/services'
import type { Service } from '@/types'

export const Route = createFileRoute('/admin/services')({
  component: AdminServicesPage,
})

function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(() => [
    ...servicesCatalog,
  ])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Service>>({})

  const toggleEnabled = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    )
  }

  const openEdit = (service: Service) => {
    setEditingId(service.id)
    setEditForm({ ...service })
  }

  const saveEdit = () => {
    if (!editingId) return
    setServices((prev) =>
      prev.map((s) => (s.id === editingId ? { ...s, ...editForm } : s)),
    )
    setEditingId(null)
    setEditForm({})
  }

  return (
    <DashboardLayout variant="admin">
      <PageHeader
        title="Service catalog"
        subtitle="Manage services, estimated price and TAT, and allowed type."
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Est. price (USD)
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Est. TAT (days)
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Allowed type
                </th>
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Enabled
                </th>
                <th className="px-4 py-3 text-right font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    ${s.estimatedPriceUsd}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.estimatedTatDays} days
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.allowedType}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleEnabled(s.id)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ToggleLeft
                        className={`h-5 w-5 ${s.enabled ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                      {s.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(s)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditingId(null)}
        >
          <Card
            className="w-full max-w-lg rounded-2xl border border-border shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
              <CardTitle className="text-lg">Edit service</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingId(null)}
              >
                Close
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editForm.name ?? ''}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description ?? ''}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Estimated price (USD)</Label>
                  <Input
                    type="number"
                    value={editForm.estimatedPriceUsd ?? 0}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        estimatedPriceUsd: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated TAT (days)</Label>
                  <Input
                    type="number"
                    value={editForm.estimatedTatDays ?? 0}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        estimatedTatDays: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Allowed type</Label>
                <select
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  value={editForm.allowedType ?? 'Both'}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      allowedType: e.target.value as Service['allowedType'],
                    }))
                  }
                >
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
