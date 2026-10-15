import AccountPageShell from "../account/AccountPageShell";
import { sellerNavItems } from "./sellerNav";

type SellerPageShellProps = {
  children: React.ReactNode;
};

// Каркас кабінету продавця: той самий, що й у покупця, але зі своїм меню
export default function SellerPageShell({ children }: SellerPageShellProps) {
  return (
    <AccountPageShell
      navItems={sellerNavItems}
      toggleHint="Кабінет продавця"
      navLabel="Розділи кабінету продавця"
    >
      {children}
    </AccountPageShell>
  );
}