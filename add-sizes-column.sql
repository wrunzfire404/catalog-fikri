-- Tambah kolom sizes untuk fitur "Variasi Ukuran" (opsional)
-- Sistem PGRB sudah otomatis mendukung variasi ukuran secara backward-compatible.
-- Jika ingin menambahkan kolom resmi di Supabase, jalankan script ini di SQL Editor:
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb;
