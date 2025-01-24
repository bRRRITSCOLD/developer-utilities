// node_modules
import * as React from "react"

// components
import { AppUtilityMenu } from "@/components/app/app-utility-menu"
import { AppMenu } from "@/components/app/app-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppMenu/>
      </SidebarHeader>
      <SidebarContent>
        <AppUtilityMenu/>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
