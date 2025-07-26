import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { BusinessMetrics } from "@/components/business-metrics"
import { AIInsights } from "@/components/ai-insights"
import { TaskOverview } from "@/components/task-overview"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Suspense fallback={<div className="h-48 bg-white rounded-lg animate-pulse" />}>
              <BusinessMetrics />
            </Suspense>

            <Suspense fallback={<div className="h-64 bg-white rounded-lg animate-pulse" />}>
              <AIInsights />
            </Suspense>

            <Suspense fallback={<div className="h-48 bg-white rounded-lg animate-pulse" />}>
              <TaskOverview />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
