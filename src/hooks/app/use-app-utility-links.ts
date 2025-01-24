// node_modules
import { useRouterState } from "@tanstack/react-router"
import { KeyRound, Vault, Wrench } from "lucide-react"
import { useMemo } from "react"

export const useUtilityLinks = () => {
  const router = useRouterState()

  const utilityLinks = [
    {
      label: "Developer Utilities",
      href: "/",
      icon: Wrench,
      links: [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Settings",
          href: "/settings",
        }
      ]
    },
    {
      label: "Stronghold",
      href: "/stronghold",
      icon: Vault,
      links: [
        {
          label: "Home",
          href: "/stronghold",
        },
        {
          label: "Settings",
          href: "/stronghold/settings",
        }
      ]
    },
    {
      label: "Identity Management",
      href: "/identity-management",
      icon: KeyRound,
      links: [
        {
          label: "Home",
          href: "/identity-management",
        },
        {
          label: "Settings",
          href: "/identity-management/settings",
        }
      ]
    },
  ]

  const activeUtilityLink = useMemo(() => {
    if (router.location.href === '/' || router.location.href === '' || router.location.href === '/settings') {
      return utilityLinks[0]
    }

    return utilityLinks.slice(1).find(item => router.location.href.startsWith(item.href))!
  }, [router.location.href])

  const inactiveUtilityLinks = useMemo(() => {
    if (router.location.href === '/' || router.location.href === '') {
      return utilityLinks.slice(1)
    }

    return [utilityLinks[0], ...utilityLinks.slice(1).filter(item => !router.location.href.startsWith(item.href))]!
  }, [router.location.href])


  return {
    utilityLinks,
    activeUtilityLink,
    inactiveUtilityLinks
  }
}