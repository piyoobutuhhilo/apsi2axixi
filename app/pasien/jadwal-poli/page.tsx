"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PoliItem {
  id: string;
  nama: string;
  deskripsi: string;
  ikon: React.ReactNode;
}

export default function JadwalPoliPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const listPoli: PoliItem[] = [
    {
      id: "umum",
      nama: "Poli Umum",
      deskripsi: "Pemeriksaan kesehatan umum & keluhan medis harian",
      ikon: (
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M19 11v4a2 2 0 01-2 2h-1" />
          <path d="M21 11h-4" />
        </svg>
      ),
    },
    {
      id: "kandungan",
      nama: "Poli Kandungan",
      deskripsi: "Pemeriksaan kehamilan, USG, & konsultasi KIA",
      ikon: (
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="5" r="3" />
          <path d="M10 8v4c0 1.5-1 3-1 5a4 4 0 008 0c0-3-3-4-3-6V8" />
          <path d="M8 12c-1.5 0-2.5 1-2.5 2.5" />
        </svg>
      ),
    },
    {
      id: "gigi",
      nama: "Poli Gigi",
      deskripsi: "Pembersihan karang, penambalan, & pencabutan gigi",
      ikon: (
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M7 3C4.5 3 3 5 3 7.5c0 3 1.5 6 2 9.5.5 3.5 2 4 3.5 4 1.5 0 2-2 3.5-2s2 2 3.5 2c1.5 0 3-.5 3.5-4 .5-3.5 2-6.5 2-9.5C21 5 19.5 3 17 3c-2 0-3.5 1.5-5 1.5S9 3 7 3z" />
          <path d="M12 9v4m-2-2h4" />
        </svg>
      ),
    },
    {
      id: "penyakit-dalam",
      nama: "Poli Penyakit Dalam",
      deskripsi: "Pemeriksaan metabolik, lambung, organ dalam, & hipertensi",
      ikon: (
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 3v3m0 0c0 3.5-2.5 5.5-4 7s-1 4 .5 5.5 4 1 6-.5 3.5-3.5 3.5-6.5c0-4-3-5.5-6-8.5z" />
          <path d="M10 13c1 0 2 1 2 2" />
        </svg>
      ),
    },
    {
      id: "anak",
      nama: "Poli Anak",
      deskripsi: "Tumbuh kembang anak, imunisasi, & kesehatan balita",
      ikon: (
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="8" cy="6" r="2.5" />
          <circle cx="16" cy="6" r="2.5" />
          <path d="M4 19v-4a3 3 0 013-3h2a3 3 0 013 3v4" />
          <path d="M12 19v-4a3 3 0 013-3h2a3 3 0 013 3v4" />
          <path d="M10 14h4" />
        </svg>
      ),
    },
  ];

  const filteredPoli = listPoli.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-[#1e5f44] text-gray-800 overflow-hidden flex flex-col font-sans select-none p-6 md:p-10">
      {/* Ornamen Lingkaran Sudut Kiri Atas Seperti Gambar Word */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-12 -left-8 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />

      {/* Tombol Kembali (Bentuk Pill Khas Desain Asli) */}
      <div className="relative z-10 mb-8">
        <button
          onClick={() => router.push("/pasien/dashboard")}
          className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/40 shadow-md transition cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-white text-[#1e5f44] flex items-center justify-center font-bold">
            ‹
          </div>
          <span>Kembali</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col">
        {/* Label Tab 'Pencarian Poli' Hijau Terang Pill */}
        <div className="self-start -mb-1 z-20">
          <div className="bg-[#00a859] text-white text-sm font-bold px-10 py-2.5 rounded-full border-2 border-[#1e5f44] shadow-md">
            Pencarian Poli
          </div>
        </div>

        {/* Input Bar Pencarian dengan Tombol 'Cari' Hijau */}
        <div className="w-full bg-[#e2e8f0] rounded-full p-1.5 pl-6 flex items-center shadow-lg border border-white mb-8">
          <svg
            className="w-5 h-5 text-gray-500 mr-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Masukkan Nama Poli"
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 text-sm font-medium focus:outline-none"
          />
          <button className="bg-[#00a859] hover:bg-[#008f4c] text-white text-sm font-bold px-8 py-2 rounded-full shadow transition cursor-pointer">
            Cari
          </button>
        </div>

        {/* Kotak Kontainer Besar 'Hasil Pencarian' */}
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-400">
          {/* Header Bar Kontainer */}
          <div className="bg-[#00a859] py-3 text-center text-white font-extrabold text-base tracking-wide">
            Hasil Pencarian
          </div>

          {/* Area Konten Abu-abu di Bawahnya */}
          <div className="bg-[#cdd7e1] p-6 md:p-8 min-h-[360px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPoli.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/pasien/jadwal-poli/${item.id}`)}
                  className="group bg-[#95d5b2] hover:bg-[#74c69d] transition-all cursor-pointer rounded-3xl p-5 border-2 border-slate-700/80 shadow-md flex flex-col items-center justify-between text-center min-h-[170px] hover:scale-[1.02]"
                >
                  <div className="text-slate-900 group-hover:scale-105 transition-transform mt-2">
                    {item.ikon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-2">
                      {item.nama}
                    </h3>
                    <p className="text-[11px] text-emerald-950 font-bold mt-0.5">
                      Lihat Jadwal Dokter &rarr;
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredPoli.length === 0 && (
              <div className="h-48 flex items-center justify-center text-gray-600 font-semibold text-sm">
                Tidak ada poli yang cocok dengan "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}