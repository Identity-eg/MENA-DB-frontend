import { Menu, ShieldCheck } from 'lucide-react'
import { Button } from './ui/button'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
        <ShieldCheck className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 grid place-items-center text-xs font-bold text-primary">
            JD
          </div>
          <span className="hidden text-sm font-medium sm:inline-block">
            John Doe
          </span>
        </div>
      </div>
    </header>
  )
}
