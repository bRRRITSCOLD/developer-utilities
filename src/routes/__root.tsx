import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { homeDir } from '@tauri-apps/api/path';
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect } from 'react';
import { warn, debug, trace, info, error } from '@tauri-apps/plugin-log';
import { invoke } from '@tauri-apps/api/core';
import { StrongholdPluginInitDialog } from '@/components/stronghold/stronghold-plugin-init-dialog';

const __Root = () => {
  const openWindow = async (window: WebviewWindow) => {
    if (!(await window.isVisible())) {
      window.show()
    }
  }

  useEffect(() => {
    openWindow(getCurrentWebviewWindow())
  }, [])

  return (
    <>
      <StrongholdPluginInitDialog/>
      {/* <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr /> */}
      <Outlet />
    </>
  )
}

export const Route = createRootRoute({
  component: __Root,
})
