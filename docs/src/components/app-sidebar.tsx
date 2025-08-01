import * as React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from '~/components/ui/sidebar';

// MonkeyJs documentation structure
const data = {
  navMain: [
    {
      title: 'Introduction',
      url: '/docs',
      items: [],
    },
    {
      title: 'Getting Started',
      url: '/docs/setup',
      items: [
        {
          title: 'Installation',
          url: '/docs/setup',
        },
      ],
    },
    {
      title: 'API Reference',
      url: '/docs/api',
      items: [
        {
          title: 'Core API',
          url: '/docs/api#core-api',
        },
        {
          title: 'React API',
          url: '/docs/api#react-api',
        },
      ],
    },
    {
      title: 'Configuration',
      url: '/docs/configuration',
      items: [
        {
          title: 'Tour Configuration',
          url: '/docs/configuration#tour-configuration',
        },
        {
          title: 'Controller Configuration',
          url: '/docs/configuration#controller-configuration',
        },
        {
          title: 'Popover Configuration',
          url: '/docs/configuration#popover-configuration',
        },
        {
          title: 'Theme Configuration',
          url: '/docs/configuration#theme-configuration',
        },
      ],
    },
    {
      title: 'Examples',
      url: '/docs/examples',
      items: [
        {
          title: 'Basic Tour Example',
          url: '/docs/examples#basic-tour-example',
        },
        {
          title: 'Custom Themed Tour',
          url: '/docs/examples#custom-themed-tour',
        },
        {
          title: 'React Integration Example',
          url: '/docs/examples#react-integration-example',
        },
        {
          title: 'Advanced Event Handling',
          url: '/docs/examples#advanced-event-handling',
        },
      ],
    },
    {
      title: 'Types Reference',
      url: '/docs/types',
      items: [
        {
          title: 'Core Types',
          url: '/docs/types#core-types',
        },
        {
          title: 'UI Component Types',
          url: '/docs/types#ui-component-types',
        },
        {
          title: 'Event Types',
          url: '/docs/types#event-types',
        },
        {
          title: 'React Types',
          url: '/docs/types#react-types',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarProvider>
      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/docs">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">MonkeyJs</span>
                    <span className="">Documentation</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={item.isActive}
                          >
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
