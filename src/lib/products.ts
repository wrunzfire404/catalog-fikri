import rereHitamAsset from "@/assets/rere-hitam.png.asset.json";
import rereBwAsset from "@/assets/rere-bw.png.asset.json";
import rereMaroonAsset from "@/assets/rere-maroon.png.asset.json";
import rereCoklatTuaAsset from "@/assets/rere-coklat-tua.png.asset.json";
import rerePinkAsset from "@/assets/rere-pink.png.asset.json";
import rereCreamAsset from "@/assets/rere-cream.png.asset.json";

export type ProductVariant = {
  slug: string;
  color: string;
  image?: string;
};

export type Product = {
  slug: string;
  code: string;
  name: string;
  ld: string;
  pj: string;
  price: number;
  note?: string;
  image?: string;
  variants?: ProductVariant[];
};

const rereVariants: ProductVariant[] = [
  { slug: "maroon", color: "Maroon", image: rereMaroonAsset.url },
  { slug: "hitam", color: "Hitam", image: rereHitamAsset.url },
  { slug: "bw", color: "BW", image: rereBwAsset.url },
  { slug: "coklat-tua", color: "Coklat Tua", image: rereCoklatTuaAsset.url },
  { slug: "pink", color: "Pink", image: rerePinkAsset.url },
  { slug: "cream", color: "Cream", image: rereCreamAsset.url },
];

export const products: Product[] = [
  {
    slug: "rere",
    code: "B",
    name: "RERE",
    ld: "110-115",
    pj: "55",
    price: 63000,
    note: "Rajut premium dengan beberapa varian warna.",
    image: rereVariants[0]?.image,
    variants: rereVariants,
  },
  { slug: "dz-sultan", code: "C", name: "DZ Sultan", ld: "100", pj: "55", price: 54000 },
  { slug: "dz-warna", code: "C", name: "DZ Warna", ld: "100", pj: "55", price: 54000 },
  { slug: "dz-oca", code: "C", name: "DZ OCA", ld: "100", pj: "55", price: 54000, note: "Bahan rajut murce" },
  { slug: "salur-sultan", code: "A", name: "Salur Sultan", ld: "110-120", pj: "55-57", price: 59000 },
  { slug: "sailor-isabela", code: "A", name: "SAILOR ISABELA", ld: "110-120", pj: "57", price: 64000 },
  { slug: "kerah-alina", code: "B", name: "Kerah Alina", ld: "110-120", pj: "60", price: 64000 },
  { slug: "kriwil", code: "B", name: "KRIWIL", ld: "80-100", pj: "55", price: 50000 },
  { slug: "clarys-stripe", code: "A", name: "CLARYS STRIPE", ld: "110-120", pj: "58", price: 64000 },
  { slug: "stripe-mila", code: "C", name: "STRIPE MILA", ld: "100-110", pj: "55", price: 45000 },
];

export const WA_NUMBER = "6283131261552";
export const SHOP_NAME = "PGRB";
export const SHOP_TAGLINE = "Pusat Grosir Rajut Bandung";

export function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export function getProductGallery(product: Product) {
  if (product.variants?.length) {
    return product.variants;
  }

  return [
    {
      slug: product.slug,
      color: product.name,
      image: product.image,
    },
  ];
}

export function waLink(product?: Product, variant?: ProductVariant | null) {
  const variantLine = variant ? `\nWarna ${variant.color}` : "";
  const text = product
    ? `Halo PGRB, saya tertarik dengan produk:\n\n*${product.code}. ${product.name}*${variantLine}\nLD ${product.ld} • PJ ${product.pj}\nHarga ${formatRupiah(product.price)}\n\nApakah masih ready?`
    : `Halo PGRB, saya mau tanya katalog rajutnya 🙏`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
