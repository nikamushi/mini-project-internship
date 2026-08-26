export type SeedUser = { name: string; email: string; role: string };

export const SEED_USERS: SeedUser[] = [
  { name: "Admin Kampus", email: "admin@example.com", role: "ADMIN" },
  { name: "Mahasiswa Contoh", email: "user@example.com", role: "USER" },
  { name: "Budi Santoso", email: "budi.santoso@student.ac.id", role: "USER" },
  { name: "Siti Rahma", email: "siti.rahma@student.ac.id", role: "USER" },
  { name: "Andi Wijaya", email: "andi.wijaya@student.ac.id", role: "USER" },
  { name: "Dewi Lestari", email: "dewi.lestari@student.ac.id", role: "USER" },
];

export const CATEGORY_NAMES = ["Elektronik", "Dokumen", "Pakaian", "Aksesori", "Buku", "Lainnya"];

export type SeedItem = { cat: string; name: string; desc: string; loc: string };

const E = "Elektronik";
const D = "Dokumen";
const P = "Pakaian";
const A = "Aksesori";
const B = "Buku";
const L = "Lainnya";

export const SEED_ITEMS: SeedItem[] = [
  { cat: A, name: "Dompet kulit hitam", desc: "Dompet kulit hitam dengan logo kecil di bagian depan.", loc: "Perpustakaan Kampus" },
  { cat: E, name: "Headphone nirkabel putih", desc: "Headphone Bluetooth putih dengan casing charger di sisi kanan.", loc: "Kantin Kampus" },
  { cat: B, name: "Buku catatan kuliah", desc: "Buku catatan bercover biru berisi materi semester lima.", loc: "Gedung A" },
  { cat: E, name: "Power bank 10.000mAh", desc: "Power bank hitam merek Anker, ada goresan di sudut.", loc: "Perpustakaan Kampus" },
  { cat: D, name: "Kartu tanda mahasiswa", desc: "KTM fakultas teknik, kartu sedikit terlipat di sudutnya.", loc: "Kantin Kampus" },
  { cat: P, name: "Jaket hoodie abu-abu", desc: "Hoodie abu-abu ukuran L, manset agak kusut.", loc: "Lapangan Basket" },
  { cat: L, name: "Tumbler hijau 750ml", desc: "Tumbler stainless hijau dengan stiker band di badan botol.", loc: "Kantin Kampus" },
  { cat: A, name: "Jam tangan silver", desc: "Jam tangan analog rantai silver merek Seiko.", loc: "Masjid Kampus" },
  { cat: B, name: "Novel Laskar Pelangi", desc: "Novel bekas sampul krem, tepi halaman sobek sedikit.", loc: "Perpustakaan Kampus" },
  { cat: D, name: "Sertifikat TOEFL ITP", desc: "Sertifikat TOEFL ITP dalam folder plastik transparan.", loc: "Gedung B" },
  { cat: P, name: "Topi bisma hitam", desc: "Topi bisma hitam dengan bordir kecil di bagian depan.", loc: "Aula Utama" },
  { cat: E, name: "Kalkulator Casio fx-991", desc: "Kalkulator scientific dengan nama tertulis di bagian belakang.", loc: "Gedung A" },
  { cat: L, name: "Payung transparan", desc: "Payung dome transparan dengan gagang kayu melengkung.", loc: "Lorong Fakultas Teknik" },
  { cat: A, name: "Kacamata hitam", desc: "Sunglass frame kotak hitam, disertai case hitam.", loc: "Aula Utama" },
  { cat: D, name: "Bukti pembayaran UKT", desc: "Printout bukti transfer UKT semester genap.", loc: "Ruang Kelas 2.1" },
  { cat: B, name: "Modul statistika 2024", desc: "Modul praktikum statistika edisi baru berstempel lab.", loc: "Lab Komputer" },
  { cat: P, name: "Syal rajut merah", desc: "Syal rajut merah marun panjang sekitar 1,5 meter.", loc: "Taman Kampus" },
  { cat: E, name: "Flashdisk 32GB biru", desc: "Flashdisk plastik biru dengan tali gantungan hitam.", loc: "Lab Komputer" },
  { cat: A, name: "Tas ransel navy", desc: "Tas ransel biru tua kompartemen laptop, resleting sisi agak rusak.", loc: "Parkiran Motor" },
  { cat: L, name: "Lunch box stainless", desc: "Kotak makan dua susun warna silver dengan klip samping.", loc: "Kantin Kampus" },
  { cat: D, name: "SIM C + holder kartu", desc: "SIM C masih berlaku di dalam holder kartu biru.", loc: "Parkiran Motor" },
  { cat: B, name: "Sketchbook A5", desc: "Sketchbook A5 isi sketsa arsitektur, cover hitam polos.", loc: "Taman Kampus" },
  { cat: P, name: "Handuk gym biru", desc: "Handuk olahraga biru terlipat rapi saat ditemukan.", loc: "Masjid Kampus" },
  { cat: E, name: "Charger laptop Lenovo", desc: "Adaptor kotak besar dengan kabel dililit karet.", loc: "Ruang Kelas 2.1" },
  { cat: A, name: "Kunci motor + gantungan", desc: "Set kunci motor dengan gantungan karakter beruang.", loc: "Parkiran Motor" },
  { cat: L, name: "Kartu ATM BCA", desc: "Kartu debit atas nama pemilik di dompet kartu.", loc: "Parkiran Motor" },
  { cat: D, name: "Akta kelahiran dalam map", desc: "Map coklat berisi akta kelahiran dan fotokopi KK.", loc: "Gedung B" },
  { cat: B, name: "Kamus Inggris-Indonesia", desc: "Kamus tebal cover hijau edisi kelima.", loc: "Gedung B" },
  { cat: P, name: "Cardigan coklat", desc: "Cardigan rajut coklat muda ukuran M kancing kayu.", loc: "Perpustakaan Kampus" },
  { cat: E, name: "Mouse wireless hitam", desc: "Mouse Logitech tanpa kabel, baterai masih terpasang.", loc: "Lorong Fakultas Teknik" },
  { cat: A, name: "Anting perak kecil", desc: "Sepasang anting perak model bulat kecil.", loc: "Taman Kampus" },
  { cat: L, name: "Helm hitam doff", desc: "Helm half-face hitam doff ukuran M kaca bening.", loc: "Parkiran Motor" },
  { cat: D, name: "Surat keterangan lulus", desc: "SKL berstempel basah dengan tanda tangan kaprodi.", loc: "Aula Utama" },
  { cat: B, name: "Buku algoritma hardcover", desc: "Introduction to Algorithms cover hitam tebal.", loc: "Lab Komputer" },
  { cat: P, name: "Jersey olahraga oranye", desc: "Kaos olahraga oranye nomor punggung 7.", loc: "Lapangan Basket" },
  { cat: E, name: "Smartwatch hitam", desc: "Smartwatch strap silikon, goresan tipis di layar.", loc: "Lapangan Basket" },
  { cat: A, name: "Kalung perak + liontin", desc: "Kalung perak tipis dengan liontin huruf awal nama.", loc: "Masjid Kampus" },
  { cat: L, name: "Kotak pensil transparan", desc: "Kotak plastik bening isi pulpen dan stabilo.", loc: "Gedung A" },
  { cat: D, name: "Portofolio gambar teknik", desc: "Map gambar format A3 berisi gambar proyeksi.", loc: "Lorong Fakultas Teknik" },
  { cat: B, name: "Majalah teknologi Juni", desc: "Majalah gadget lokal terbuka di halaman review HP.", loc: "Kantin Kampus" },
  { cat: P, name: "Ikat pinggang kulit", desc: "Ikat pinggang kulit coklat gelap gesper perak.", loc: "Masjid Kampus" },
  { cat: E, name: "Speaker bluetooth mini", desc: "Speaker silinder merah bata dengan strap karet.", loc: "Aula Utama" },
  { cat: A, name: "Cincin perak ukiran", desc: "Cincin perak motif tribal ukuran 7.", loc: "Taman Kampus" },
  { cat: L, name: "Name tag seminar", desc: "Name tag peserta seminar dengan lanyard biru.", loc: "Aula Utama" },
  { cat: D, name: "Transkrip nilai sementara", desc: "Transkrip nilai 6 semester dalam map kuning.", loc: "Gedung B" },
  { cat: B, name: "Buku anatomi kedokteran", desc: "Buku anatomi tebal edisi terjemahan Sobotta.", loc: "Perpustakaan Kampus" },
  { cat: P, name: "Mukena warna mint", desc: "Mukena travel warna mint dalam pouch jaring.", loc: "Masjid Kampus" },
  { cat: E, name: "Earbuds TWS putih", desc: "Earbuds True Wireless dengan charging case putih.", loc: "Gedung A" },
  { cat: A, name: "Gelang tali warna", desc: "Gelang anyam tali biru-kuning gaya friendship.", loc: "Lapangan Basket" },
  { cat: L, name: "Sepeda lipat merah", desc: "Sepeda lipat merk Pacific, spion kanan lepas.", loc: "Parkiran Motor" },
  { cat: E, name: "Kabel data USB-C", desc: "Kabel data USB-C panjang 1 meter warna putih.", loc: "Perpustakaan Kampus" },
  { cat: L, name: "Gantungan kunci rubber", desc: "Gantungan kunci karakter katak hijau.", loc: "Taman Kampus" },
];

export type ReportStatusSeed = "PENDING_VERIFICATION" | "ACTIVE" | "COMPLETED" | "CLOSED" | "REJECTED";

export const STATUS_CYCLE: ReportStatusSeed[] = [
  "ACTIVE",
  "ACTIVE",
  "ACTIVE",
  "ACTIVE",
  "PENDING_VERIFICATION",
  "ACTIVE",
  "COMPLETED",
  "ACTIVE",
  "CLOSED",
  "REJECTED",
  "ACTIVE",
  "ACTIVE",
  "PENDING_VERIFICATION",
];

export const CLAIM_REASONS = [
  "Barang ini milik saya, ada ciri khas stiker di bagian bawah.",
  "Saya yakin itu punya saya karena warna dan mereknya sama persis.",
  "Barang hilang dari lokasi tersebut hari itu juga, ada foto lama sebagai bukti.",
  "Ciri-cirinya cocok: ada goresan di sisi kanan seperti milik saya.",
  "Itu barang saya yang hilang minggu lalu di area yang sama.",
  "Nomor seri pada barang sesuai dengan nota pembelian saya.",
];

export const REJECT_REASONS = [
  "Deskripsi tidak cukup spesifik, mohon lengkapi bukti kepemilikan.",
  "Warna dan ciri barang tidak sesuai catatan penemu.",
];
