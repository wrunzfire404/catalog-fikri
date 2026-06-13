-- Tambah kolom featured untuk fitur "Produk Rekomendasi"
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
