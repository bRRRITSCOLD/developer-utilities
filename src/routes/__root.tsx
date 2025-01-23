import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { homeDir } from '@tauri-apps/api/path';
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect } from 'react';
import { warn, debug, trace, info, error } from '@tauri-apps/plugin-log';
import { invoke } from '@tauri-apps/api/core';
import { StrongholdPluginInitDialog } from '@/components/stronghold/stronghold-plugin-init-dialog';
import { getCurrentWindow, Window } from '@tauri-apps/api/window';

const __Root = () => {
  const openWindow = async (window: Window) => {
    if (!(await window.isVisible())) {
      await window.show()
      await window.center()
    } else {
      await window.center()
    }
    
  }

  useEffect(() => {
    openWindow(getCurrentWindow())
  }, [])

  return (
    <>
      <Outlet />
    </>
  )
}

export const Route = createRootRoute({
  component: __Root,
})
