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

const breadcrumbs = [
  {
    path: '',
    breadcrumb: 'Utilities'
  },
  {
    path: 'stronghold',
    breadcrumb: 'Stronghold'
  },
  {
    path: 'jwt',
    breadcrumb: 'JWT'
  }
]

function LayoutComponent() {
  const router = useRouterState()

  const pathParts = useMemo(() => {
    const split = router.location.href.split('/')
    return (split[0] === '' && split[1] === '' ? split.slice(1) : split).reduce((b: { path: string, breadcrumb: string; }[], part) => {
      const found = breadcrumbs.find(item => item.path === part)
      if (found) {
        b.push(found)
      }
      return b
    }, [])
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
                    pathParts.map((item, i) =>
                      <Fragment key={i}>
                        <BreadcrumbItem className="hidden md:block">
                            <Link href={item.path}>
                              {item.breadcrumb}
                            </Link>
                          </BreadcrumbItem>
                        {i === pathParts.length - 1 ? null : <BreadcrumbSeparator className="hidden md:block" />}
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
