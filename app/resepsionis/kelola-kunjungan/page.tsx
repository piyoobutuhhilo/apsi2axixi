"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AntreanItem {
  id: string;
  kode_antrean: string;
  kode_asli: string;
  nama_pasien: string;
  nik: string;
  poli: string;
  dokter: string;
  tanggal_periksa: string;
  status: string;
}

function formatTanggalJam(dateStr: string) {
  if (!dateStr) return { tgl: "Senin / 26 Oktober 2026", jam: "13.46 WIB" };
  const d = new Date(dateStr);
  const tgl = d
    .toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(",", " /");

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return {
    tgl,
    jam: `${hours}.${minutes} WIB`,
  };
}

export default function CekKodeAntreanResepsionisPage() {
  const router = useRouter();
  const [listAntrean, setListAntrean] = useState<AntreanItem[]>([]);
  const [selectedAntrean, setSelectedAntrean] = useState<AntreanItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/resepsionis/antrean", { cache: "no-store" });
        const json = await res.json();
        if (json.data) {
          setListAntrean(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = listAntrean.filter(
    (item) =>
      item.nama_pasien.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_antrean.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search)
  );

  return (
    <div className="relative min-h-screen w-full bg-[#1b5d44] text-gray-900 overflow-hidden flex flex-col font-sans select-none p-5 md:p-8">
      {}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-48 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      {}
      <div className="relative z-10 w-full mb-4 flex justify-between items-center">
        <button
          onClick={() => {
            if (selectedAntrean) {
              setSelectedAntrean(null);
            } else {
              router.push("/resepsionis/dashboard");
            }
          }}
          className="inline-flex items-center space-x-2 bg-white/15 hover:bg-white/25 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/25 shadow-md transition cursor-pointer backdrop-blur-sm"
        >
          <div className="w-5 h-5 rounded-full bg-white text-[#1b5d44] flex items-center justify-center font-bold text-xs">
            ‹
          </div>
          <span>{selectedAntrean ? "Daftar Pasien Antre" : "Kembali"}</span>
        </button>

        <span className="text-xs md:text-sm text-emerald-200 font-semibold">
          Loket Resepsionis — Cek Kode Antrean
        </span>
      </div>

      {}
      {selectedAntrean ? (
        <div className="relative z-10 w-full flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-[#d5dde2] rounded-[32px] p-8 md:p-12 shadow-2xl flex flex-col justify-between min-h-[460px] border border-slate-300 relative">
            {}
            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-serif font-black tracking-wider text-[#1e3d30]">
                PUSKESMAS PAUH
              </h2>
              <p className="text-[11px] md:text-xs text-slate-700 font-serif mt-0.5">
                Jl. Irigasi, Cupak Tangah, Kecamatan Pauh, Kota Padang, Sumatera Barat 25176
              </p>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-6">
              {}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Kode Antrian
                </span>
                <span className="text-6xl md:text-7xl font-black text-black font-sans tracking-tight mt-2">
                  {selectedAntrean.kode_antrean}
                </span>
                <span className="text-xs text-slate-600 font-semibold mt-3">
                  Poli: <strong>{selectedAntrean.poli}</strong> • {selectedAntrean.nama_pasien}
                </span>
              </div>

              {}
              <div className="flex justify-center md:justify-end">
                <div className="bg-[#66b6a3] p-4 rounded-xl shadow-md flex flex-col items-center max-w-[260px] w-full">
                  <div className="bg-white p-2 rounded-lg w-full flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                        selectedAntrean.kode_asli || selectedAntrean.kode_antrean
                      )}`}
                      alt={`QR Code ${selectedAntrean.kode_antrean}`}
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-[#0f2c22] font-semibold text-center mt-2">
                    Silakan Scan Kartu ini di Meja Resepsionis
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="w-full text-center font-serif text-slate-800 border-t border-slate-300/60 pt-3">
              <p className="text-xs font-semibold">
                {formatTanggalJam(selectedAntrean.tanggal_periksa).tgl}
              </p>
              <p className="text-xs">
                {formatTanggalJam(selectedAntrean.tanggal_periksa).jam}
              </p>
              <p className="text-sm md:text-base font-serif italic mt-1 font-medium">
                Terimakasih, Semoga Cepat Sembuh
              </p>
            </div>
          </div>
        </div>
      ) : (
       
        <div className="relative z-10 w-full flex-1 bg-[#d5dde2] rounded-[32px] p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="w-full flex flex-col space-y-4 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-400/40">
              <div>
                <h3 className="text-lg md:text-xl font-black text-[#1b5d44]">
                  Daftar Pasien Sedang Mengantri
                </h3>
                <p className="text-xs text-slate-600">
                  Klik pada salah satu pasien untuk membuka tampilan Kartu Kode Antrean & QR Code
                </p>
              </div>

              <input
                type="text"
                placeholder="Cari nama / kode antrean / NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs md:text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#1b5d44]"
              />
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-y-auto max-h-[55vh]">
              {loading ? (
                <div className="py-16 text-center text-slate-500 font-bold text-sm">
                  Memuat data antrean pasien...
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-slate-400 font-medium text-sm">
                  Tidak ada pasien dalam daftar antrean saat ini.
                </div>
              ) : (
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#427a63] text-white uppercase text-[11px] font-extrabold tracking-wider">
                      <th className="py-3 px-4">No. Antrean</th>
                      <th className="py-3 px-4">Nama Pasien</th>
                      <th className="py-3 px-4">NIK</th>
                      <th className="py-3 px-4">Poli Tujuan</th>
                      <th className="py-3 px-4">Dokter</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filtered.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedAntrean(item)}
                        className="hover:bg-emerald-50/70 transition cursor-pointer"
                      >
                        <td className="py-3 px-4 font-mono font-black text-lg text-[#1b5d44]">
                          {item.kode_antrean}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item.nama_pasien}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {item.nik}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {item.poli}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {item.dokter}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            className="bg-[#1b5d44] hover:bg-[#144733] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                          >
                            Buka Kode →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}