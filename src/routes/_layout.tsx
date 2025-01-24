import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { Fragment, useMemo } from 'react'
import { AppSidebar } from "@/components/app/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})

const rootBreadcrumbs = [
  {
    path: '/',
    breadcrumb: 'Home'
  },
  {
    path: '/settings',
    breadcrumb: 'Settings'
  }
]

const otherBreadcrumbs = [
  {
    path: '/stronghold',
    breadcrumb: 'Stronghold'
  },
  {
    path: '/stronghold/settings',
    breadcrumb: 'Settings'
  },
  {
    path: '/identity-management',
    breadcrumb: 'Identity Management'
  },
  {
    path: '/identity-management/settings',
    breadcrumb: 'Settings'
  }
]

function LayoutComponent() {
  const router = useRouterState()

  const pathcrumbs = useMemo(() => {
    if (router.location.href === '/' || router.location.href === '') {
      return [rootBreadcrumbs[0]]
    }

    const otherPathcrumbs = otherBreadcrumbs.filter(item => router.location.href.includes(item.path))

    if (otherPathcrumbs.length > 0) {
      return otherPathcrumbs
    }

    const rootPathcrumbs = rootBreadcrumbs.filter(item => router.location.href.includes(item.path))

    return rootPathcrumbs
  }, [router.location.href])

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {
                    pathcrumbs.map((item, i) =>
                      <Fragment key={i}>
                        <BreadcrumbItem className="hidden md:block">
                            <Link href={item.path}>
                              {item.breadcrumb}
                            </Link>
                          </BreadcrumbItem>
                        {i === pathcrumbs.length - 1 ? null : <BreadcrumbSeparator className="hidden md:block" />}
                      </Fragment>
                    )
                  }
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
