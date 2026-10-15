import type { AccountNavItem } from "../account/AccountSidebar";

// Пункти навігації кабінету продавця
export const sellerNavItems: AccountNavItem[] = [
  { label: "Огляд", icon: "/icons/shop.svg", href: "/seller" },
  { label: "Товари", icon: "/icons/catalog.svg", href: "/seller/products" },
  { label: "Замовлення", icon: "/icons/box.svg", href: "/seller/orders" },
  { label: "Кабінет покупця", icon: "/icons/user.svg", href: "/account" },
];