import CategoryProductsGrid from "../../../components/catalog/CategoryProductsGrid";
import { getSellerProducts } from "../../../lib/api/sellers";

type SellerProductsPageProps = {
  params: Promise<{ id: string }>;
};

// Временная версия вкладки «Товари продавця» — полную (категории, сортировка) делаем в шаге 3
export default async function SellerProductsPage({ params }: SellerProductsPageProps) {
  const { id } = await params;
  const { products } = await getSellerProducts(id);

  return <CategoryProductsGrid title="Усі товари" products={products} />;
}