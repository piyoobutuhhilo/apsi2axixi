"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface JadwalDetail {
  id_jadwal?: string;
  hari?: string;
  jam_mulai?: string | Date;
  jam_selesai?: string | Date;
}

interface BookingItem {
  id_booking: string;
  id_pasien: string;
  kode_antrean: string;
  tanggal_booking: string;
  tanggal_pemeriksaan: string;
  status: string;
  poli?: { nama_poli: string };
  dokter?: { nama_dokter: string };
  jadwal?: JadwalDetail;
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

function parseJamString(timeVal: string | Date | undefined | null): string | null {
  if (!timeVal) return null;
  const str = String(timeVal);

 
  if (str.includes("T")) {
    const timePart = str.split("T")[1];
    const parts = timePart.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}.${parts[1]}`;
    }
  }

  
  if (str.includes(":")) {
    const parts = str.split(":");
    if (parts.length >= 2) {
    
      const h = parts[0].trim().slice(-2);
      const m = parts[1].trim().slice(0, 2);
      return `${h}.${m}`;
    }
  }

  
  try {
    const d = new Date(timeVal);
    if (!isNaN(d.getTime())) {
      return `${String(d.getUTCHours()).padStart(2, "0")}.${String(d.getUTCMinutes()).padStart(2, "0")}`;
    }
  } catch {
    return null;
  }

  return null;
}

function formatWaktuPemeriksaan(item: BookingItem): string {
  const mulai = parseJamString(item.jadwal?.jam_mulai);
  const selesai = parseJamString(item.jadwal?.jam_selesai);

  if (mulai && selesai) {
    return `Pukul ${mulai} - ${selesai} WIB`;
  }
  if (mulai) {
    return `Pukul ${mulai} WIB`;
  }

  
  if (item.tanggal_pemeriksaan && item.tanggal_pemeriksaan.includes("T")) {
    const timePart = item.tanggal_pemeriksaan.split("T")[1];
    const parts = timePart.split(":");
    if (parts[0] !== "00" || parts[1] !== "00") {
      return `Pukul ${parts[0]}.${parts[1]} WIB`;
    }
  }

  return "Sesuai Jadwal Dokter";
}

export default function RiwayatBookingPasienPage() {
  const router = useRouter();

  const [riwayat, setRiwayat] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  
  const [modalDetail, setModalDetail] = useState<BookingItem | null>(null);
  const [targetHapus, setTargetHapus] = useState<string | null>(null);

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pasien/booking/riwayat", { cache: "no-store" });
      const json = await res.json();
      if (json.data) {
        setRiwayat(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const handleHapusBooking = async () => {
    if (!targetHapus) return;
    try {
      await fetch(`/api/pasien/booking/riwayat?id=${targetHapus}`, {
        method: "DELETE",
      });
      setTargetHapus(null);
      await fetchRiwayat();
    } catch (e) {
      alert("Gagal menghapus data booking");
    }
  };

  const handleEdit = (item: BookingItem) => {
    if (item.status === "Dibatalkan") {
      alert("Jadwal booking ini telah dibatalkan oleh petugas. Silakan buat booking baru!");
      return;
    }
    router.push(`/pasien/booking/baru?edit=${item.id_booking}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1b5d44] text-gray-900 overflow-hidden flex flex-col font-sans select-none p-5 md:p-8">
      {}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-48 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      {}
      <div className="relative z-10 w-full mb-4">
        <button
          onClick={() => router.push("/pasien/booking")}
          className="inline-flex items-center space-x-2 bg-white/15 hover:bg-white/25 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/25 shadow-md transition cursor-pointer backdrop-blur-sm"
        >
          <div className="w-5 h-5 rounded-full bg-white text-[#1b5d44] flex items-center justify-center font-bold text-xs">
            ‹
          </div>
          <span>Kembali</span>
        </button>
      </div>

      {}
      <div className="relative z-10 w-full max-w-xs mb-3">
        <div className="bg-[#00a859] text-white font-extrabold text-sm md:text-base py-2.5 px-8 rounded-full shadow-md text-center border-2 border-emerald-900/20">
          Data Booking Pengguna
        </div>
      </div>

      {}
      <div className="relative z-10 w-full flex-1 bg-[#d5dde2] rounded-[32px] overflow-hidden shadow-2xl flex flex-col border border-emerald-900/30">
        {}
        <div className="w-full bg-[#00a859] text-white font-extrabold text-base md:text-lg py-3 text-center shadow-sm">
          Hasil Pemeriksaan
        </div>

        {}
        <div className="w-full grid grid-cols-12 bg-[#b8ddca] border-b-2 border-slate-400 text-center font-black text-xs md:text-sm text-slate-900 py-2.5">
          <div className="col-span-2 border-r border-slate-400">ID / Kode</div>
          <div className="col-span-4 border-r border-slate-400">Tanggal Booking</div>
          <div className="col-span-4 border-r border-slate-400">Tanggal Pemeriksaan & Status</div>
          <div className="col-span-2">Aksi</div>
        </div>

        {}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-16 text-slate-600 font-bold text-sm">
              Memuat data booking dari database...
            </div>
          ) : riwayat.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-semibold text-sm">
              Belum ada riwayat booking jadwal aktif.
            </div>
          ) : (
            riwayat.map((item) => {
              const isBatal = item.status === "Dibatalkan";
              const isHadir = item.status === "Dikonfirmasi";

              return (
                <div
                  key={item.id_booking}
                  className={`w-full grid grid-cols-12 border-b border-slate-300 text-xs md:text-sm font-mono text-slate-900 min-h-[68px] items-stretch transition ${
                    isBatal ? "bg-rose-50/70 opacity-90" : "bg-[#d5dde2]"
                  }`}
                >
                  {}
                  <div className="col-span-2 border-r border-slate-400 flex flex-col items-center justify-center p-3 text-center">
                    <span className={`font-bold ${isBatal ? "line-through text-rose-800" : ""}`}>
                      {item.id_pasien || item.id_booking}
                    </span>
                    <span className="text-[10px] text-slate-600 font-sans font-semibold">
                      {item.kode_antrean}
                    </span>
                  </div>

                  {}
                  <div className="col-span-4 border-r border-slate-400 flex items-center p-3 font-sans">
                    <span>{formatTanggalIndo(item.tanggal_booking)}</span>
                  </div>

                  {}
                  <div className="col-span-4 border-r border-slate-400 flex flex-col justify-center p-3 font-sans leading-tight">
                    <span className={`font-semibold ${isBatal ? "line-through text-slate-500" : ""}`}>
                      {formatTanggalIndo(item.tanggal_pemeriksaan)}
                    </span>
                    <span className="text-[11px] text-slate-700 font-medium mt-0.5">
                      {formatWaktuPemeriksaan(item)}
                    </span>

                    {}
                    <div className="mt-1.5 flex items-center gap-2">
                      {isBatal && (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          ✕ Ditolak / Dibatalkan Petugas
                        </span>
                      )}
                      {isHadir && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          ✓ Terkonfirmasi Hadir di Loket
                        </span>
                      )}
                      {!isBatal && !isHadir && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          ⏳ Menunggu Konfirmasi Resepsionis
                        </span>
                      )}
                    </div>
                  </div>

                  {}
                  <div className="col-span-2 grid grid-cols-3 h-full">
                    {}
                    <button
                      onClick={() => setModalDetail(item)}
                      className="bg-[#0b5cbf] hover:bg-[#084896] text-white flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-bold p-1 transition cursor-pointer"
                      title="Lihat Detail Tiket"
                    >
                      <span>👁</span>
                      <span className="hidden sm:inline">Lihat</span>
                    </button>

                    {}
                    <button
                      disabled={isBatal}
                      onClick={() => handleEdit(item)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-bold p-1 transition ${
                        isBatal
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                          : "bg-[#eab308] hover:bg-[#ca8a04] text-slate-900 cursor-pointer"
                      }`}
                      title={isBatal ? "Booking ini telah dibatalkan" : "Edit Jadwal Booking"}
                    >
                      <span>✎</span>
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {}
                    <button
                      onClick={() => setTargetHapus(item.id_booking)}
                      className="bg-[#b91c1c] hover:bg-[#991b1b] text-white flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-bold p-1 transition cursor-pointer"
                      title="Hapus Dari Riwayat"
                    >
                      <span>🗑</span>
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {}
      {modalDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-emerald-300 flex flex-col">
            <h3 className="text-base font-black text-[#1b5d44] mb-3 text-center border-b pb-2">
              Detail Status Tiket Booking
            </h3>

            <div className="space-y-2 text-xs text-slate-700 mb-5">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-slate-500">Status Pemeriksaan:</span>
                <span
                  className={`font-black px-2 py-0.5 rounded text-[11px] uppercase ${
                    modalDetail.status === "Dibatalkan"
                      ? "bg-rose-100 text-rose-700"
                      : modalDetail.status === "Dikonfirmasi"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {modalDetail.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kode Antrean:</span>
                <span className="font-extrabold text-[#1b5d44] font-mono">{modalDetail.kode_antrean}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Poli Tujuan:</span>
                <span className="font-bold">{modalDetail.poli?.nama_poli || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dokter Pemeriksa:</span>
                <span className="font-bold">{modalDetail.dokter?.nama_dokter || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jadwal Periksa:</span>
                <span className="font-bold text-right">
                  {formatTanggalIndo(modalDetail.tanggal_pemeriksaan)}
                  <br />
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    {formatWaktuPemeriksaan(modalDetail)}
                  </span>
                </span>
              </div>

              {modalDetail.status === "Dibatalkan" && (
                <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] leading-relaxed">
                  ⚠️ <strong>Catatan Petugas:</strong> Pengajuan booking ini telah ditolak/dibatalkan oleh resepsionis. Silakan lakukan pendaftaran ulang atau hubungi petugas loket.
                </div>
              )}
            </div>

            <button
              onClick={() => setModalDetail(null)}
              className="w-full bg-[#1b5d44] hover:bg-[#154633] text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {}
      {targetHapus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#e2f0e9] rounded-3xl p-6 shadow-2xl border-2 border-slate-300 flex flex-col items-center">
            <div className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-800 text-xs font-semibold py-2 rounded-full text-center mb-6">
              Hapus Data Ini dari Riwayat?
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <button
                onClick={handleHapusBooking}
                className="w-44 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-extrabold py-2 rounded-lg shadow cursor-pointer"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setTargetHapus(null)}
                className="w-44 bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-extrabold py-2 rounded-lg shadow cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}