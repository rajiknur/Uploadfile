# 🌟 Modern LinkTree

Website keren buat kamu yang pengen punya page kayak LinkTree tapi dengan tampilan yang lebih keren, fitur music player, dan gampang diubah-ubah lewat file JSON.

![Modern LinkTree Demo](ss.jpg)

## ✨ Fitur-Fitur Keren

- 🎵 **Music Player**
- 👋 **Welcome Screen**
- 📱 **Responsive**
- 🔗 **Link yang Kece** 
- ⚡ **Animasi Keren**
- 🛠️ **Gampang Diedit* - Cukup ubah file JSON aja

## 🚀 Cara Pakai

### Buat yang Pemula Banget

1. **Download Semua File**
   - Download file `index.html`, `styles.css`, `script.js`, dan `data.json`
   - Simpan di folder yang sama

2. **Edit `data.json`**
   - Buka pakai Notepad atau editor teks lainnya
   - Ganti info profil, link, dan musik sesuai keinginan kamu

3. **Upload ke Hosting**
   - Upload semua file ke hosting kamu (bisa pake Netlify, Vercel, atau hosting biasa)
   - Dan... jadi deh! 🎉

### Detail Cara Edit `data.json`

```json
{
    "profile": {
        "name": "Nama Kamu",  // <- Ganti dengan nama kamu
        "bio": "Deskripsi singkat tentang kamu",  // <- Ganti dengan bio kamu
        "image": "URL_FOTO_KAMU"  // <- Ganti dengan link foto kamu
    },
    
    "links": [
        // 👇 Bisa ditambah/dikurangi sesuai kebutuhan
        {
            "title": "Instagram",  // <- Judul link
            "url": "https://instagram.com/usernamekamu",  // <- URL tujuan
            "icon": "fab fa-instagram"  // <- Icon (jangan diubah kecuali kamu paham)
        },
        // Tambah link lain di sini...
    ],
    
    "music": {
        "title": "Judul Lagu",  // <- Judul lagu
        "artist": "Nama Penyanyi",  // <- Nama artis/band
        "albumArt": "URL_COVER_LAGU",  // <- Link cover albumnya
        "duration": 180,  // <- Durasi lagu dalam detik
        
        // 👇 Lirik dengan timing (dalam detik)
        // Lirik akan muncul satu-satu sesuai waktu yang kamu atur
        "timeSync": [
            { "time": 0, "text": "Intro musik..." },
            { "time": 5, "text": "Lirik baris pertama" },
            { "time": 10, "text": "Lirik baris kedua" },
            { "time": 15, "text": "Lirik baris ketiga" },
            // Dan seterusnya...
        ]
    }
}
```

## 🎨 Kustomisasi Lebih Lanjut

### Ganti Icon

Kamu bisa ganti icon di link dengan cek daftar icon Font Awesome di:
https://fontawesome.com/icons

Cukup ganti `"icon": "fab fa-instagram"` dengan icon lain, misalnya `"fab fa-tiktok"` untuk TikTok.

### Warna Custom

Warnanya otomatis ngikutin foto profil kamu, tapi kalau mau kustom:

1. Buka file `styles.css`
2. Cari bagian `:root` di awal file
3. Ganti nilai warna yang ada, contoh:
   ```css
   :root {
       --primary-color: #FF0000; /* Warna merah */
       --secondary-color: #0000FF; /* Warna biru */
   }
   ```

### Contoh Penggunaan Lirik Multi-baris

Sekarang Anda bisa menambahkan lirik dengan baris ganda untuk menampilkan terjemahan atau informasi tambahan. Gunakan karakter `\n` untuk membuat baris baru dalam lirik. Contoh:

```json
"timeSync": [
    { "time": 0, "text": "Intro musik..." },
    { "time": 5, "text": "Lirik bahasa asli\nTerjemahan dalam bahasa Indonesia" },
    { "time": 10, "text": "Lirik baris kedua\nTerjemahan baris kedua" },
    // ... dan seterusnya
]
```

#### Tips Penggunaan:

1. **Desain Dual-bahasa**:
   ```json
   { "time": 15, "text": "I still hear your voice when you sleep next to me\nAku masih mendengar suaramu saat kau tidur di sampingku" }
   ```

2. **Penjelasan Lirik**:
   ```json
   { "time": 20, "text": "Love is a losing game\n(Amy merujuk pada hubungan yang gagal)" }
   ```

3. **Lirik dengan Catatan**:
   ```json
   { "time": 25, "text": "Semua yang tersimpan\n(Bagian chorus utama)" }
   ```

4. **Font Kreatif**:
   ```json
   { "time": 30, "text": "♪ Instrumental break ♪\n~ Musik tanpa lirik ~" }
   ```

5. **Efek Dramatis**:
   ```json
   { "time": 35, "text": "The end of all things\n..." }
   ```

#### Hasil Akhir:

Lirik akan ditampilkan dalam dua baris di music player, memberikan pengalaman karaoke dwibahasa yang lebih lengkap!

## 💡 Tips

1. **Foto Profil**: Pake foto dengan resolusi 400x400 pixel biar optimal
2. **Lirik**: Sesuaikan timing lirik dengan lagu aslinya biar pas
3. **Link**: Urutin dari yang paling penting ke yang kurang penting
4. **Testing**: Coba buka di HP dan laptop sebelum dishare ke orang lain

## ❓ Troubleshooting

**Foto/Musik Gak Muncul?**
- Pastikan URL-nya benar dan bisa diakses
- Coba gunakan layanan seperti Imgur untuk foto atau Dropbox untuk musik

**Icon Tampil Aneh?**
- Pastikan nama iconnya benar dan pakai prefix yang tepat (`fas` atau `fab`)

**Link Gak Bisa Diklik?**
- Pastikan URL dimulai dengan `https://`


## ✌️ Catatan

Dibuat dengan ❤️ buat kamu yang pengen punya landing page keren tanpa ribet coding.

Feel free untuk modifikasi sesuai kebutuhan kamu!
