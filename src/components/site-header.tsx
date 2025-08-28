import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import ThemeToggleButton from "@/components/ui/theme-toggle-button"

export const SiteHeader = React.memo(function SiteHeader(): React.ReactElement {
  return (
    <header 
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
      role="banner"
      aria-label="Site header"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
          aria-hidden="true"
        />
        <h1 className="text-base font-medium" id="site-title">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggleButton variant="circle-blur" start="top-right" />
        </div>
      </div>
    </header>
  )
});
