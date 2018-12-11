export class LinkGroup {
  label: string
  links: Link[]
  open?: boolean
  icon?: string
}

export class Link {
  label: string
  path: string
  icon?: string
}
export const sidebarTopLinks: Link[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard'
  }
];
export const sidebarGroups: LinkGroup[] = [
  {
    label: 'Conference',
    icon: 'supervisor_account',
    open: true,
    links: [
      {
        label: 'Speakers',
        path: '/conference/speakers',
        icon: 'person_outline'
      },
      {
        label: 'Sessions',
        path: '/conference/sessions',
        icon: 'calendar_today'
      },
      {
        label: 'Schedule',
        path: '/conference/schedule',
        icon: 'calendar_view_day'
      },
      {
        label: 'Sponsors',
        path: '/conference/sponsors',
        icon: 'monetization_on '
      }
    ]
  },
  {
    label: 'System',
    icon: 'adjust',
    open: false,
    links: [
      {
        label: 'Users',
        path: '/system/users',
        icon: 'people'
      },
      {
        label: 'Settings',
        path: '/settings',
        icon: 'settings'
      }
    ]
  }
];

