export interface SideNavItem {
    type: string,
    icon: string,
    label: string,
    children: Array<NavegacionItem>
}

export interface NavegacionItem {
    type: string,
    router: string,
    icon: string,
    label: string
}
