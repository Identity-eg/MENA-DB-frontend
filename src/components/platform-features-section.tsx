import { Building2, CheckCircle, Globe, ShieldCheck, Zap } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: any
  title: string
  description: string
}) {
  return (
    <Card className="flex flex-col hover:ring-primary/30 gap-3 transition-all">
      <CardHeader>
        <Icon size={24} className="text-primary" />
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export function PlatformFeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 border-t">
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="text-3xl font-semibold">
            Unrivaled data coverage across the MENA region.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our intelligence network spans 22 countries, delivering real-time
            insights into PEPs, sanctions, and corporate structures.
          </p>
          <div className="mt-8 space-y-4">
            {[
              'Unified MENA Database',
              'Real-time Sanctions Checks',
              'Asset Tracking & Wealth Signals',
              'Court & Litigation History',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <CheckCircle size={16} className="text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <FeatureItem
            icon={ShieldCheck}
            title="Risk Intelligence"
            description="Global PEP, sanctions, and adverse media screening with automated monitoring."
          />
          <FeatureItem
            icon={Building2}
            title="Corporate Links"
            description="Deep ownership analysis, identifying UBOs and complex directorship networks."
          />
          <FeatureItem
            icon={Globe}
            title="Local Expertise"
            description="Arabic language name matching and local database verification for high accuracy."
          />
          <FeatureItem
            icon={Zap}
            title="Rapid Delivery"
            description="Guaranteed evaluation TAT with digital PDF deliverables for every request."
          />
        </div>
      </div>
    </section>
  )
}
