"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PoliItem {
  id: string;
  nama: string;
}

export default function JadwalDokterResepsionisPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const listPoli: PoliItem[] = [
    { id: "anak", nama: "Poli Anak" },
    { id: "gigi", nama: "Poli Gigi" },
    { id: "umum", nama: "Poli Umum" },
    { id: "kandungan", nama: "Poli Kandungan" },
    { id: "penyakit-dalam", nama: "Poli Penyakit Dalam" },
  ];

  const filteredPoli = listPoli.filter((poli) =>
    poli.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-[#20674f] text-gray-800 overflow-hidden flex flex-col font-sans select-none p-5 md:p-8">
      {/* Ornamen Lengkungan Abstrak Kiri Sesuai Gambar */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-48 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      {/* ================= BAR ATAS ================= */}
      <div className="relative z-10 w-full flex justify-between items-center mb-6">
        {/* Tombol Kembali (Pojok Kiri Atas) */}
        <button
          onClick={() => router.push("/resepsionis/dashboard")}
          className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/30 shadow-md transition cursor-pointer backdrop-blur-sm"
        >
          <div className="w-5 h-5 rounded-full bg-white text-[#20674f] flex items-center justify-center font-bold text-xs">
            ‹
          </div>
          <span>Kembali</span>
        </button>

        {/* Tombol Kuning: Lihat Jadwal Kerja Perawat (Pojok Kanan Atas) */}
        <button
          onClick={() => router.push("/resepsionis/jadwal/perawat")}
          className="bg-[#fef08a] hover:bg-[#fde047] text-slate-900 font-bold text-xs md:text-sm px-6 py-2.5 rounded-full shadow-md border border-amber-300 transition-all cursor-pointer hover:scale-[1.02]"
        >
          Lihat Jadwal Kerja Perawat
        </button>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="relative z-10 w-full mb-6">
        <div className="w-full bg-[#dbe2e6] rounded-full px-5 py-3 flex items-center shadow-md border border-white/80">
          <svg
            className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama poli..."
            className="w-full bg-transparent text-gray-800 placeholder-gray-500 text-sm font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* ================= KONTAINER ABU-ABU BESAR ================= */}
      <div className="relative z-10 w-full flex-1 bg-[#d5dde2] rounded-[32px] p-6 md:p-10 shadow-2xl min-h-[460px] flex flex-col">
        {/* List Baris Poli */}
        <div className="flex flex-col space-y-4">
          {filteredPoli.map((poli) => (
            <div
              key={poli.id}
              className="w-full bg-[#3ea870] hover:bg-[#379764] rounded-full py-3 px-6 shadow-md border-b-4 border-[#1e4a36] flex items-center justify-between transition-all"
            >
              {/* Nama Poli */}
              <span className="text-white font-bold text-sm md:text-base tracking-wide drop-shadow-sm">
                {poli.nama}
              </span>

              {/* Tombol Lihat Jadwal di Sebelah Kanan */}
              <button
                onClick={() => router.push(`/resepsionis/jadwal/${poli.id}`)}
                className="bg-[#bbf7d0] hover:bg-[#86efac] active:scale-95 text-[#14532d] text-xs font-extrabold px-5 py-1.5 rounded-full border border-[#22c55e] shadow-sm transition-all cursor-pointer"
              >
                Lihat Jadwal
              </button>
            </div>
          ))}

          {filteredPoli.length === 0 && (
            <div className="text-center py-16 text-slate-500 font-semibold text-sm">
              Poli dengan kata kunci "{searchTerm}" tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}