import type { Metadata } from "next";
import SellerPageShell from "../../components/seller/SellerPageShell";
import SellerOverview from "../../components/seller/SellerOverview";
import PageTitle from "../../components/account/PageTitle";

export const metadata: Metadata = {
  title: "Кабінет продавця — Treba",
};

export default function SellerOverviewPage() {
  return (
    <SellerPageShell>
      <PageTitle>Огляд магазину</PageTitle>
      <SellerOverview />
    </SellerPageShell>
  );
}