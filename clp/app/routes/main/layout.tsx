import { useEffect, useState } from "react"
import { Outlet, type MetaFunction, useLocation } from "react-router"
import { CommunitiesSidebar } from "~/components/layout/CommunitiesSidebar"
import { SettingsSidebar } from "~/components/layout/SettingsSidebar"
import { Sidebar } from "~/components/layout/Sidebar"
import { SidebarRail } from "~/components/layout/SidebarRail"
import { StatusSidebar } from "~/components/layout/StatusSidebar"
import { cn } from "~/lib/utils"
import NavProgress from "~/components/nav-progress"

export const meta: MetaFunction = () => {
  return [
    { title: "Clp Cloud" },
    { name: "description", content: "CLP Cloud is a platform for managing your cloud resources." },
  ]
}

const layout = () => {
  const location = useLocation()
  const mobileContentRoutes = ["/chat/", "/status/", "/communities/", "/settings/"]
  const shouldShowContentOnMobile = mobileContentRoutes.some((route) =>
    location.pathname.startsWith(route)
  )
  const showSidebarOnMobile = !shouldShowContentOnMobile
  const showContentOnMobile = shouldShowContentOnMobile
  const pathname = location.pathname
  const [activeSection, setActiveSection] = useState<
    "chat" | "status" | "communities" | "settings"
  >("chat")

  useEffect(() => {
    if (pathname === "/" || pathname.startsWith("/chat/")) {
      setActiveSection("chat")
    }
  }, [pathname])

  const sidebarContent =
    activeSection === "chat" ? (
      <Sidebar />
    ) : activeSection === "status" ? (
      <StatusSidebar />
    ) : activeSection === "communities" ? (
      <CommunitiesSidebar />
    ) : (
      <SettingsSidebar />
    )

  return (
    <>
      <NavProgress />
      <div className="fixed top-0 left-0 w-full h-full bg-background text-foreground">
        <div className="mx-auto flex w-full h-full">
          <aside
            className={cn(
              "border-border bg-card/50 h-full",
              "md:flex md:w-[430px] md:flex-row md:border-r",
              showSidebarOnMobile ? "flex w-full flex-col" : "hidden"
            )}
          >
            <div className="hidden md:flex">
              <SidebarRail
                activeSection={activeSection}
                onSelectSection={setActiveSection}
              />
            </div>
            <div className="min-w-0 flex-1 h-full overflow-y-auto">
              {sidebarContent}
            </div>
            <div className="md:hidden">
              <SidebarRail
                orientation="horizontal"
                activeSection={activeSection}
                onSelectSection={setActiveSection}
              />
            </div>
          </aside>

          <main
            className={cn(
              "flex-1 h-full",
              showContentOnMobile ? "block" : "hidden",
              "md:block"
            )}
          >
              <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default layout