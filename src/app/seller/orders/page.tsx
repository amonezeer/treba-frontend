import type { Metadata } from "next";
import SellerPageShell from "../../../components/seller/SellerPageShell";
import SellerOrders from "../../../components/seller/SellerOrders";
import PageTitle from "../../../components/account/PageTitle";

export const metadata: Metadata = {
  title: "Замовлення — Кабінет продавця — Treba",
};

type SellerOrdersPageProps = {
  searchParams: Promise<{ order?: string | string[] }>;
};

// ?order=<id> — замовлення, яке відкривається одразу (посилання з «Огляду»)
export default async function SellerOrdersPage({ searchParams }: SellerOrdersPageProps) {
  const { order } = await searchParams;
  const initialOrderId = typeof order === "string" ? order : undefined;

  return (
    <SellerPageShell>
      <PageTitle>Замовлення</PageTitle>
      {/* key: при переході з іншим ?order= компонент стартує заново */}
      <SellerOrders key={initialOrderId ?? "all"} initialOrderId={initialOrderId} />
    </SellerPageShell>
  );
}