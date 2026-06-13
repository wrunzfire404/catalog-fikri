-- ============================================
-- FIX: Pastiin UPDATE work (jika belum)
-- Run di SQL Editor Supabase
-- ============================================

-- Re-appply policy untuk products (ALL = SELECT + INSERT + UPDATE + DELETE)
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Test: lihat apakah kolom featured ada
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'featured';

-- Test: update salah satu produk untuk pastiin bisa
UPDATE products SET featured = true WHERE slug = 'rere';
SELECT slug, name, featured FROM products WHERE slug = 'rere';
