import type { Metadata } from "next";
import SellerPageShell from "../../../components/seller/SellerPageShell";
import SellerProducts from "../../../components/seller/SellerProducts";
import PageTitle from "../../../components/account/PageTitle";

export const metadata: Metadata = {
  title: "Товари — Кабінет продавця — Treba",
};

export default function SellerProductsPage() {
  return (
    <SellerPageShell>
      <PageTitle>Товари</PageTitle>
      <SellerProducts />
    </SellerPageShell>
  );
}