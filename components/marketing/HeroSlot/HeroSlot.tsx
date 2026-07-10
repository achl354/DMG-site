import { getAllProducts } from "@/lib/content/products";
import { Scroller } from "@/components/scroller/Scroller";

export function HeroSlot() {
  const products = getAllProducts();
  return <Scroller products={products} />;
}
