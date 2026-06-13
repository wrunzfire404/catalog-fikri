-- ============================================
-- FIX SEMUA: Hapus RLS ketat, izinkan semua akses lewat anon key
-- Karena ini toko pribadi tanpa multi-user, pakai RLS permisif
-- Run di SQL Editor Supabase
-- ============================================

-- === DROP semua policy lama ===
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Admin insert products" ON products;
DROP POLICY IF EXISTS "Admin update products" ON products;
DROP POLICY IF EXISTS "Admin delete products" ON products;

DROP POLICY IF EXISTS "Public read settings" ON settings;
DROP POLICY IF EXISTS "Admin upsert settings" ON settings;

DROP POLICY IF EXISTS "Public view images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete images" ON storage.objects;

-- === BIKIN policy baru: semua operasi diizinkan (anon key) ===

-- Products
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Settings
CREATE POLICY "Allow all operations on settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Storage
CREATE POLICY "Allow all get images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Allow all upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Allow all update images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Allow all delete images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
