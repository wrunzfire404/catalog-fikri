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
  { slug: "maroon", color: "Maroon", image: "/images/rere-maroon.png" },
  { slug: "hitam", color: "Hitam", image: "/images/rere-hitam.png" },
  { slug: "bw", color: "BW", image: "/images/rere-bw.png" },
  { slug: "coklat-tua", color: "Coklat Tua", image: "/images/rere-coklat-tua.png" },
  { slug: "pink", color: "Pink", image: "/images/rere-pink.png" },
  { slug: "cream", color: "Cream", image: "/images/rere-cream.png" },
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
  { slug: "dz-sultan", code: "C", name: "DZ Sultan", ld: "100", pj: "55", price: 54000, image: "/images/dz-sultan.png" },
  { slug: "dz-warna", code: "C", name: "DZ Warna", ld: "100", pj: "55", price: 54000, image: "/images/dz-warna.png" },
  { slug: "dz-oca", code: "C", name: "DZ OCA", ld: "100", pj: "55", price: 54000, note: "Bahan rajut murce", image: "/images/dz-oca.png" },
  { slug: "salur-sultan", code: "A", name: "Salur Sultan", ld: "110-120", pj: "55-57", price: 59000, image: "/images/salur-sultan.png" },
  { slug: "sailor-isabela", code: "A", name: "SAILOR ISABELA", ld: "110-120", pj: "57", price: 64000, image: "/images/sailor-isabela.png" },
  { slug: "kerah-alina", code: "B", name: "Kerah Alina", ld: "110-120", pj: "60", price: 64000, image: "/images/kerah-alina.png" },
  { slug: "kriwil", code: "B", name: "KRIWIL", ld: "80-100", pj: "55", price: 50000, image: "/images/kriwil.png" },
  { slug: "clarys-stripe", code: "A", name: "CLARYS STRIPE", ld: "110-120", pj: "58", price: 64000, image: "/images/clarys-stripe.png" },
  { slug: "stripe-mila", code: "C", name: "STRIPE MILA", ld: "100-110", pj: "55", price: 45000, image: "/images/stripe-mila.png" },
];

export const WA_NUMBER = "6283131261552";
export const SHOP_NAME = "PGRB";
export const SHOP_TAGLINE = "Pusat Grosir Rajut Bandung";
export const SHOP_ADDRESS = "Jl. Caringin No. 123, Babakan Ciparay, Bandung, Jawa Barat 40223";
export const SHOP_MAPS = "https://maps.google.com/?q=PGRB+Pusat+Grosir+Rajut+Bandung+Caringin+Babakan+Ciparay";

export function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export type CartItem = {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
};

export type CustomerInfo = {
  nama: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  noWa: string;
  catatan: string;
};

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

export function waCheckoutLink(cart: CartItem[], customer: CustomerInfo) {
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let text = `🛍️ *ORDER BARU — PGRB*\n\n`;

  text += `📦 *Detail Pesanan:*\n`;
  text += `──────────────────\n`;
  cart.forEach((item, index) => {
    const variantText = item.variant && item.variant.color !== item.product.name
      ? ` — Warna *${item.variant.color}*`
      : "";
    const subtotal = item.product.price * item.quantity;
    text += `${index + 1}. ${item.product.code}. *${item.product.name}*${variantText}\n`;
    text += `   ${item.quantity} x ${formatRupiah(item.product.price)} = ${formatRupiah(subtotal)}\n`;
  });
  text += `──────────────────\n`;
  text += `💰 *Total: ${formatRupiah(total)}*\n\n`;

  text += `👤 *Data Customer:*\n`;
  text += `Nama        : ${customer.nama}\n`;
  text += `No WA       : ${customer.noWa}\n`;
  text += `Alamat      : ${customer.kecamatan}, ${customer.kabupaten}, ${customer.provinsi}\n`;
  if (customer.catatan) {
    text += `Catatan     : ${customer.catatan}\n`;
  }
  text += `\nMohon dikonfirmasi ketersediaan stok & ongkir ya, Kak 🙏`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function waCsLink() {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo PGRB, saya mau tanya katalog rajutnya 🙏")}`;
}
