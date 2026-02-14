import { ShieldCheck } from 'lucide-react'

export function HomeFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-12">
        <div className="flex items-center gap-2 grayscale opacity-60">
          <ShieldCheck size={20} />
          <span className="text-sm font-bold tracking-tighter">
            CompliancePortal
          </span>
        </div>
        <div className="flex gap-8 text-xs font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Service Terms
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact Support
          </a>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground/40 uppercase">
          &copy; 2026 Compliance Intelligence Platform
        </div>
      </div>
    </footer>
  )
}
