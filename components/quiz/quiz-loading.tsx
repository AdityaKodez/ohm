"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function QuizLoading() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Sidebar side="right">
          <SidebarContent className="gap-6">
            <div className="px-4 pt-6">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-4 px-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-32" />
            </div>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}
