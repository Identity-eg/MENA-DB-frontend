import { Link, createFileRoute } from '@tanstack/react-router'
import { Building2, ExternalLink, Search, Unlock } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import {
  getUnlocksQueryOptions,
  useGetUnlocks,
} from '@/apis/unlocks/get-unlocks'

export const Route = createFileRoute('/_protected/unlocks/')({
  component: UnlocksPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getUnlocksQueryOptions())
    return {}
  },
})

function formatFieldName(fieldName: string) {
  return (
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ')
  )
}

function formatUnlockedValue(
  value: string | number | Array<string> | null | undefined,
): string {
  if (value == null) return '—'
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function UnlocksPage() {
  const { data } = useGetUnlocks()
  const unlocks = data?.data ?? []

  return (
    <div className="space-y-8">
      <div>
        <PageHeader
          title="My Unlocks"
          subtitle="Direct access to your recently unlocked company intelligence."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {unlocks.map((unlock) => (
          <Card className="p-0" key={unlock.id}>
            <CardHeader className="bg-muted/30 border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="font-semibold bg-green-50 text-green-600 border-green-400 dark:bg-green-950/50 dark:text-green-400 dark:border-green-700"
                >
                  Unlocked
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3 font-sans" dir="rtl">
                {unlock.lockedField.company.nameAr ??
                  unlock.lockedField.company.nameEn}
              </CardTitle>
              <div className="text-sm text-muted-foreground font-medium">
                {unlock.lockedField.company.nameEn}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Unlock size={16} />
                  {formatFieldName(unlock.lockedField.lockedType.fieldName)}
                </span>
                <span className="font-medium">
                  {formatUnlockedValue(unlock.unlockedValue)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="bg-transparent p-2">
              <Link
                to="/companies/$companyId"
                params={{
                  companyId: String(unlock.lockedField.company.id),
                }}
              >
                <Button variant="ghost">
                  View Full Profile
                  <ExternalLink size={16} />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        <Link to="/companies">
          <Card className="h-full flex items-center justify-center hover:ring-primary/50 transition-all">
            <div className="text-center space-y-2">
              <div className="mx-auto size-10 rounded-full bg-primary/5 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Search to Unlock More
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
