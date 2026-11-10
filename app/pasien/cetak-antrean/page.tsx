"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AntreanItem {
  id_booking: string;
  kode_antrean: string;
  tanggal_booking: string;
  tanggal_pemeriksaan: string;
  status: string;
  pasien?: {
    nama_pasien: string;
    nik: string;
    no_telepon: string;
  };
  poli?: {
    nama_poli: string;
  };
  dokter?: {
    nama_dokter: string;
  };
}

function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatJamIndo(dateStr: string): string {
  if (!dateStr) return "08.30 WIB";
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `Pukul ${hours}.${minutes} WIB`;
}

export default function CetakAntreanPage() {
  const router = useRouter();
  const [antreanList, setAntreanList] = useState<AntreanItem[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<AntreanItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAntrean() {
      try {
        setLoading(true);
        const res = await fetch("/api/pasien/antrean", { cache: "no-store" });
        const json = await res.json();
        if (json.data) {
          setAntreanList(json.data);
          // Jika hanya ada 1 booking, langsung buka struknya
          // Jika ada lebih dari 1 booking, biarkan null agar user memilih kartu terlebih dahulu
          if (json.data.length === 1) {
            setSelectedTicket(json.data[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAntrean();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1b5d44] text-gray-900 overflow-hidden flex flex-col font-sans select-none p-5 md:p-8">
      {/* Ornamen Lingkaran Sisi Kiri */}
      <div className="print:hidden absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      <div className="print:hidden absolute top-16 -left-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />

      {/* Header & Navigasi Kembali */}
      <div className="print:hidden relative z-10 w-full mb-4 flex justify-between items-center">
        <button
          onClick={() => {
            if (selectedTicket && antreanList.length > 1) {
              setSelectedTicket(null); // Kembali ke daftar pilihan tiket jika ada banyak booking
            } else {
              router.push("/pasien/dashboard");
            }
          }}
          className="inline-flex items-center space-x-2 bg-white/15 hover:bg-white/25 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/25 shadow-md transition cursor-pointer backdrop-blur-sm"
        >
          <div className="w-5 h-5 rounded-full bg-white text-[#1b5d44] flex items-center justify-center font-bold text-xs">
            ‹
          </div>
          <span>
            {selectedTicket && antreanList.length > 1
              ? "Pilih Tiket Lain"
              : "Kembali ke Dashboard"}
          </span>
        </button>

        <span className="text-xs md:text-sm text-emerald-200 font-semibold">
          Layanan Cetak Mandiri
        </span>
      </div>

      {/* Kontainer Utama */}
      <div className="relative z-10 w-full flex-1 bg-[#d5dde2] rounded-[32px] p-6 md:p-10 shadow-2xl flex flex-col items-center justify-center print:bg-transparent print:p-0 print:shadow-none">
        {loading ? (
          <div className="py-20 text-center font-bold text-slate-600">
            Memuat data tiket antrean...
          </div>
        ) : antreanList.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-2xl font-bold">
              ℹ
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Belum Ada Tiket Antrean Aktif
            </h3>
            <p className="text-xs text-slate-600 max-w-sm">
              Anda belum melakukan booking pendaftaran atau semua jadwal sebelumnya telah selesai / dibatalkan.
            </p>
            <button
              onClick={() => router.push("/pasien/booking/baru")}
              className="bg-[#1b5d44] hover:bg-[#154633] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow cursor-pointer transition"
            >
              Buat Booking Baru Sekarang
            </button>
          </div>
        ) : !selectedTicket ? (
          /* ================= TAMPILAN JIKA BOOKING LEBIH DARI 1: DAFTAR KARTU ================= */
          <div className="w-full max-w-2xl flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-black text-[#1b5d44]">
                Pilih Tiket yang Ingin Dicetak
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Ditemukan <strong>{antreanList.length} jadwal booking aktif</strong> pada akun Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {antreanList.map((item) => (
                <div
                  key={item.id_booking}
                  onClick={() => setSelectedTicket(item)}
                  className="bg-white hover:bg-emerald-50/50 border-2 border-slate-300 hover:border-[#1b5d44] p-5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono font-black text-xl text-[#1b5d44]">
                        {item.kode_antrean}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          item.status === "Dikonfirmasi"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">
                      {item.poli?.nama_poli}
                    </h4>
                    <p className="text-xs text-slate-600">{item.dokter?.nama_dokter}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500">
                      {formatTanggalIndo(item.tanggal_pemeriksaan).split(",")[0]}, {formatJamIndo(item.tanggal_pemeriksaan)}
                    </span>
                    <span className="font-bold text-[#1b5d44]">Buka Tiket →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ================= TAMPILAN DETAIL STRUK CETAK ================= */
          <div className="w-full max-w-xl flex flex-col items-center">
            {/* Navigasi ganti kartu jika ada multi-booking */}
            {antreanList.length > 1 && (
              <div className="print:hidden w-full flex justify-between items-center mb-4 px-2">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-xs font-bold text-[#1b5d44] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Ganti Tiket Booking Lain ({antreanList.length} Tiket Aktif)
                </button>
              </div>
            )}

            <div
              id="printable-ticket"
              className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-300 flex flex-col items-center text-center relative overflow-hidden print:w-full print:border-none print:shadow-none"
            >
              {/* Header Struk Puskesmas */}
              <div className="w-full border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-[#1b5d44] text-white font-bold text-xs flex items-center justify-center">
                    P
                  </div>
                  <h2 className="text-lg font-black text-[#1b5d44] tracking-tight">
                    PUSKESMAS PAUH
                  </h2>
                </div>
                <p className="text-[11px] text-slate-500">
                  Jl. Raya Pauh No. 12, Kota Padang • Telp: (0751) 71234
                </p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                  KARTU BUKTI PENDAFTARAN ANTREAN
                </p>
              </div>

              {/* Nomor Urut / Kode Antrean Utama */}
              <div className="my-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Nomor Antrean Anda
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[#1b5d44] font-mono tracking-wider mt-1 mb-2">
                  {selectedTicket.kode_antrean}
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    selectedTicket.status === "Dikonfirmasi"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  Status: {selectedTicket.status}
                </span>
              </div>

              {/* Detail Pasien & Pelayanan */}
              <div className="w-full bg-[#f8fafc] rounded-2xl p-4 border border-slate-200 text-xs text-left my-4 space-y-2">
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500">Nama Pasien:</span>
                  <span className="font-bold text-slate-900">
                    {selectedTicket.pasien?.nama_pasien || "Pasien"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500">NIK:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedTicket.pasien?.nik || "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500">Poli Tujuan:</span>
                  <span className="font-bold text-[#1b5d44]">
                    {selectedTicket.poli?.nama_poli}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-500">Dokter Pemeriksa:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedTicket.dokter?.nama_dokter}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Jadwal Pemeriksaan:</span>
                  <span className="font-bold text-right text-slate-900">
                    {formatTanggalIndo(selectedTicket.tanggal_pemeriksaan)}
                    <br />
                    <span className="text-emerald-700 font-semibold text-[11px]">
                      {formatJamIndo(selectedTicket.tanggal_pemeriksaan)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Barcode Visual */}
              <div className="w-full flex flex-col items-center border-t-2 border-dashed border-slate-300 pt-4 mt-2">
                <div className="font-mono text-xl sm:text-2xl tracking-[0.35em] text-slate-800 select-all font-bold">
                  ||| | ||||| | || |||| |
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  ID: {selectedTicket.id_booking}
                </span>
                <p className="text-[10px] text-slate-400 italic text-center mt-3">
                  *Harap tunjukkan struk antrean ini kepada petugas loket saat tiba di puskesmas.
                </p>
              </div>
            </div>

            {/* Tombol Cetak & Aksi */}
            <div className="print:hidden w-full flex flex-wrap gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={handlePrint}
                className="bg-[#1b5d44] hover:bg-[#154633] text-white font-extrabold text-xs md:text-sm px-8 py-3 rounded-2xl shadow-lg border-b-2 border-black/40 transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Cetak / Simpan PDF</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/pasien/booking/riwayat")}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs md:text-sm px-6 py-3 rounded-2xl shadow border border-slate-300 transition cursor-pointer"
              >
                Lihat Riwayat Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}