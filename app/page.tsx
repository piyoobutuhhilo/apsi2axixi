"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  // State untuk mengontrol apakah menu pilihan peran sudah dibuka
  const [showRoles, setShowRoles] = useState(false);

  const roles = [
    { label: "Resepsionis", path: "/resepsionis/login" },
    { label: "Dokter", path: "/dokter/login" },
    { label: "Perawat", path: "/perawat/login" },
    { label: "Apoteker", path: "/farmasi/login" },
    { label: "Pasien", path: "/pasien/login" },
  ];

  const handleRoleClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1e5f44] flex items-center justify-center p-3 md:p-6 font-sans select-none overflow-hidden">
      {/* Kontainer Layar Penuh Melengkung Sesuai Screenshot */}
      <div className="relative w-full h-[94vh] max-w-[98vw] rounded-[36px] overflow-hidden shadow-2xl border-4 border-emerald-400/40 bg-slate-900 flex flex-col justify-between">
        {/* Background Foto Lobi Puskesmas Full Cover */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"
            alt="Lobi Pelayanan Puskesmas"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>

        {/* ================= BAGIAN ATAS ================= */}
        <div className="relative z-10 p-6 md:p-8 flex flex-col items-center w-full">
          {/* Tombol Kembali: Hanya muncul saat menu aktor terbuka */}
          <div className="w-full flex justify-start min-h-[36px]">
            {showRoles && (
              <button
                onClick={() => setShowRoles(false)}
                className="inline-flex items-center space-x-2 bg-[#23533e] hover:bg-[#1b4332] text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-300/40 shadow-md backdrop-blur-sm cursor-pointer transition-all duration-300"
              >
                <div className="w-4 h-4 rounded-full bg-white text-[#23533e] flex items-center justify-center font-bold text-[10px]">
                  ‹
                </div>
                <span>Kembali</span>
              </button>
            )}
          </div>

          {/* Banner PUSKESMAS PAUH */}
          <div className="bg-[#b8dcd0]/95 backdrop-blur-md px-12 md:px-24 py-4 rounded-2xl shadow-xl border border-white/60 text-center -mt-2">
            <h1 className="text-3xl md:text-5xl font-serif font-extrabold tracking-[0.25em] text-[#1e4a36]">
              PUSKESMAS PAUH
            </h1>
          </div>

          {/* Banner Alamat */}
          <div className="mt-3 bg-[#d8eee5]/95 backdrop-blur-md px-8 md:px-14 py-2 rounded-xl shadow-md border border-white/50 text-center">
            <p className="text-xs md:text-sm font-medium text-slate-800">
              Jl. Irigasi, Cupak Tangah, Kecamatan Pauh, Kota Padang, Sumatera Barat 25176.
            </p>
          </div>
        </div>

        {/* ================= BAGIAN KANAN BAWAH ================= */}
        <div className="relative z-10 p-6 md:p-10 flex justify-end items-end">
          <div className="flex items-center gap-4">
            {/* Daftar Pilihan Aktor: Muncul saat tombol Masuk ditekan */}
            {showRoles && (
              <div className="flex flex-col space-y-2.5 w-60 md:w-64 animate-in fade-in slide-in-from-right-4 duration-300">
                {roles.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleRoleClick(item.path)}
                    className="w-full py-2.5 px-6 rounded-full text-xs md:text-sm font-semibold tracking-wide shadow-md bg-[#23533e] hover:bg-[#1b4332] active:scale-95 text-white border border-emerald-300/30 text-center transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Kotak Ikon Gembok & Tombol Masuk */}
            <div className="bg-[#d8eee5]/95 backdrop-blur-md rounded-2xl p-3 md:p-3.5 border-2 border-white/70 shadow-2xl flex flex-col items-center justify-between w-28 md:w-32 h-[175px]">
              {/* Ikon Gembok Medis */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-[#1f5c43] bg-white flex items-center justify-center text-[#1f5c43] shadow-inner">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              {/* Tombol Masuk: Saat ditekan membuka pilihan peran */}
              <button
                onClick={() => setShowRoles(!showRoles)}
                className="w-full bg-[#23533e] hover:bg-[#1b4332] active:scale-95 text-white text-xs font-bold py-2 rounded-xl shadow-md border border-emerald-400/40 transition-all cursor-pointer"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}