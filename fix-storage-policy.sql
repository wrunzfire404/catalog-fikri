-- ============================================
-- FIX: Storage Policy — izinkan upload dari publik
-- Run ini di SQL Editor Supabase
-- ============================================

-- Hapus policy lama yang terlalu ketat
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete images" ON storage.objects;

-- Bikin policy baru — publik bisa upload & delete ke bucket product-images
CREATE POLICY "Public upload images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public delete images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'product-images');
