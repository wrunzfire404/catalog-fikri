export type ProductVariant = {
  slug: string;
  color: string;
  image?: string;
  stock?: number;
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
  featured?: boolean;
  isHidden?: boolean;
  stock?: number;
  minOrder?: number;
};

export type Settings = {
  shopName: string;
  tagline: string;
  waNumber: string;
  address: string;
  mapsUrl: string;
  banners?: { src: string; alt: string }[];
  menuKatalogImage?: string;
  menuCsImage?: string;
  menuLokasiImage?: string;
  bannerText?: string;
  paymentInfo?: string;
};

const rereVariants: ProductVariant[] = [
  { slug: "maroon", color: "Maroon", image: "/images/rere-maroon.png" },
  { slug: "hitam", color: "Hitam", image: "/images/rere-hitam.png" },
  { slug: "bw", color: "BW", image: "/images/rere-bw.png" },
  { slug: "coklat-tua", color: "Coklat Tua", image: "/images/rere-coklat-tua.png" },
  { slug: "pink", color: "Pink", image: "/images/rere-pink.png" },
  { slug: "cream", color: "Cream", image: "/images/rere-cream.png" },
];

export const defaultProducts: Product[] = [
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

export const defaultSettings: Settings = {
  shopName: "PGRB",
  tagline: "Pusat Grosir Rajut Bandung",
  waNumber: "6283131261552",
  address: "Jl. Caringin No. 123, Babakan Ciparay, Bandung, Jawa Barat 40223",
  mapsUrl: "https://maps.google.com/?q=PGRB+Pusat+Grosir+Rajut+Bandung+Caringin+Babakan+Ciparay",
  banners: [
    { src: "/images/banner1.jpeg", alt: "Banner PGRB 1" },
    { src: "/images/banner2.jpeg", alt: "Banner PGRB 2" },
    { src: "/images/banner3.jpeg", alt: "Banner PGRB 3" },
    { src: "/images/banner4.png", alt: "Banner PGRB 4" },
  ],
  menuKatalogImage: "/images/katalog.jpeg",
  menuCsImage: "/images/cs.jpeg",
  menuLokasiImage: "/images/toko.jpeg",
  bannerText: "Rajut Premium, Harga Grosir.",
  paymentInfo: "Bank BCA: 2781764053 (a.n. Muhammad Fikri Zaini)\n\nSetelah transfer, harap konfirmasi melalui WhatsApp dengan menyertakan bukti transfer.",
};

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
  alamatLengkap: string;
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

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getWhatsAppLink(phone: string, text: string) {
  let cleanPhone = phone.replace(/\D/g, "");
  
  if (cleanPhone.startsWith("620")) {
    cleanPhone = "62" + cleanPhone.slice(3);
  }
  
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith("8")) {
    cleanPhone = "62" + cleanPhone;
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function waCheckoutLink(cart: CartItem[], customer: CustomerInfo, settings: Settings) {
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let text = `🛍️ *ORDER BARU — ${settings.shopName}*\n\n`;

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
  text += `Alamat      : ${customer.alamatLengkap}, ${customer.kecamatan}, ${customer.kabupaten}, ${customer.provinsi}\n`;
  if (customer.catatan) {
    text += `Catatan     : ${customer.catatan}\n`;
  }
  text += `\n*PENTING:*\n`;
  text += `Halo Admin, saya sudah menyelesaikan pembayaran. Berikut saya lampirkan Bukti Transfer dan file PDF Invoice pesanan saya 🙏`;

  return getWhatsAppLink(settings.waNumber, text);
}

export function waCsLink(settings: Settings) {
  return getWhatsAppLink(
    settings.waNumber,
    `Halo ${settings.shopName}, saya mau tanya katalog rajutnya 🙏`
  );
}
