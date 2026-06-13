-- ============================================
-- PGRB Catalog - Setup Database di Supabase
-- Copy & paste seluruh script ini ke SQL Editor:
-- https://ukkjgwnmukvuhzeaehec.supabase.com → SQL Editor → New Query → Paste → Run
-- ============================================

-- 1. Tabel Produk
CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  ld TEXT DEFAULT '',
  pj TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  note TEXT DEFAULT '',
  image TEXT DEFAULT '',
  variants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Settings Toko
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  shop_name TEXT NOT NULL DEFAULT 'PGRB',
  tagline TEXT NOT NULL DEFAULT 'Pusat Grosir Rajut Bandung',
  wa_number TEXT NOT NULL DEFAULT '6283131261552',
  address TEXT NOT NULL DEFAULT 'Jl. Caringin No. 123, Babakan Ciparay, Bandung, Jawa Barat 40223',
  maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=PGRB+Pusat+Grosir+Rajut+Bandung',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Insert data awal produk (default)
INSERT INTO products (slug, code, name, ld, pj, price, note, image, variants) VALUES
  ('rere', 'B', 'RERE', '110-115', '55', 63000, 'Rajut premium dengan beberapa varian warna.', '/images/rere-maroon.png', 
   '[{"slug":"maroon","color":"Maroon","image":"/images/rere-maroon.png"},{"slug":"hitam","color":"Hitam","image":"/images/rere-hitam.png"},{"slug":"bw","color":"BW","image":"/images/rere-bw.png"},{"slug":"coklat-tua","color":"Coklat Tua","image":"/images/rere-coklat-tua.png"},{"slug":"pink","color":"Pink","image":"/images/rere-pink.png"},{"slug":"cream","color":"Cream","image":"/images/rere-cream.png"}]'),
  ('dz-sultan', 'C', 'DZ Sultan', '100', '55', 54000, null, '/images/dz-sultan.png', '[]'),
  ('dz-warna', 'C', 'DZ Warna', '100', '55', 54000, null, '/images/dz-warna.png', '[]'),
  ('dz-oca', 'C', 'DZ OCA', '100', '55', 54000, 'Bahan rajut murce', '/images/dz-oca.png', '[]'),
  ('salur-sultan', 'A', 'Salur Sultan', '110-120', '55-57', 59000, null, '/images/salur-sultan.png', '[]'),
  ('sailor-isabela', 'A', 'SAILOR ISABELA', '110-120', '57', 64000, null, '/images/sailor-isabela.png', '[]'),
  ('kerah-alina', 'B', 'Kerah Alina', '110-120', '60', 64000, null, '/images/kerah-alina.png', '[]'),
  ('kriwil', 'B', 'KRIWIL', '80-100', '55', 50000, null, '/images/kriwil.png', '[]'),
  ('clarys-stripe', 'A', 'CLARYS STRIPE', '110-120', '58', 64000, null, '/images/clarys-stripe.png', '[]'),
  ('stripe-mila', 'C', 'STRIPE MILA', '100-110', '55', 45000, null, '/images/stripe-mila.png', '[]');

-- 4. Insert settings default
INSERT INTO settings (id, shop_name, tagline, wa_number, address, maps_url) VALUES
  (1, 'PGRB', 'Pusat Grosir Rajut Bandung', '6283131261552', 
   'Jl. Caringin No. 123, Babakan Ciparay, Bandung, Jawa Barat 40223',
   'https://maps.google.com/?q=PGRB+Pusat+Grosir+Rajut+Bandung+Caringin+Babakan+Ciparay');

-- 5. Row Level Security (RLS) — publik bisa baca, admin bisa edit
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Admin write access (pake Supabase Auth — hanya user logged in yg bisa edit)
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin upsert settings" ON settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 6. Storage bucket untuk upload foto
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Public bisa view foto
CREATE POLICY "Public view images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Admin bisa upload/delete foto
CREATE POLICY "Admin upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
