"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BookingItem {
  id_booking: string;
  kode_antrean: string;
  tanggal_booking: string;
  tanggal_pemeriksaan: string;
  status: string;
  pasien?: {
    id_pasien: string;
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
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatJamIndo(dateStr: string): string {
  if (!dateStr) return "08.30 WIB";
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}.${minutes} WIB`;
}

export default function KelolaBookingResepsionisPage() {
  const router = useRouter();

  const [bookingList, setBookingList] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPoli, setFilterPoli] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const url = `/api/resepsionis/booking?poli=${filterPoli}&status=${filterStatus}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.data) {
        setBookingList(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterPoli, filterStatus]);

  const handleUpdateStatus = async (id_booking: string, newStatus: string) => {
    try {
      setUpdatingId(id_booking);
      const res = await fetch("/api/resepsionis/booking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_booking, status: newStatus }),
      });

      if (res.ok) {
        await fetchBookings();
      } else {
        alert("Gagal memperbarui status");
      }
    } catch (err) {
      alert("Terjadi kendala koneksi!");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredData = bookingList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const nama = item.pasien?.nama_pasien?.toLowerCase() || "";
    const nik = item.pasien?.nik?.toLowerCase() || "";
    const kode = item.kode_antrean?.toLowerCase() || "";
    return nama.includes(q) || nik.includes(q) || kode.includes(q);
  });

  return (
    <div className="relative min-h-screen w-full bg-[#1e5f44] text-gray-900 flex items-center justify-center p-3 md:p-6 font-sans select-none overflow-hidden">
      {/* Frame Kontainer Utama Senada dengan Dashboard */}
      <div className="relative w-full h-[94vh] max-w-[98vw] rounded-[36px] overflow-hidden shadow-2xl border-4 border-emerald-400/40 bg-[#d8eee5] flex flex-col p-6 md:p-8">
        
        {/* Tombol Kembali & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-emerald-800/20">
          <button
            onClick={() => router.push("/resepsionis/dashboard")}
            className="flex items-center space-x-2 bg-white/70 hover:bg-white text-slate-800 px-4 py-2 rounded-full border border-slate-300 text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#23533e] text-white flex items-center justify-center text-xs">
              ‹
            </div>
            <span>Kembali ke Dashboard</span>
          </button>

          <div className="text-right">
            <h1 className="text-lg md:text-xl font-black text-[#153a2a]">
              Data Pendaftaran Booking Pasien
            </h1>
            <p className="text-xs text-emerald-800 font-medium">
              Verifikasi kehadiran dan validasi antrean pemeriksaan poli
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-wrap gap-3 justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Cari nama pasien / NIK / kode antrean..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs md:text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-[#1e5f44]"
          />

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterPoli}
              onChange={(e) => setFilterPoli(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e5f44]"
            >
              <option value="ALL">Semua Poli</option>
              <option value="POL001">Poli Umum</option>
              <option value="POL002">Poli Gigi</option>
              <option value="POL003">Poli Anak</option>
              <option value="POL004">Poli Penyakit Dalam</option>
              <option value="POL005">Poli Kandungan</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1e5f44]"
            >
              <option value="ALL">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Dikonfirmasi">Dikonfirmasi (Hadir)</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>

            <button
              onClick={fetchBookings}
              className="bg-[#23533e] hover:bg-[#1a3e2e] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Segarkan
            </button>
          </div>
        </div>

        {/* Tabel Data Booking */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-[#427a63] text-white uppercase text-[11px] font-extrabold tracking-wider">
                  <th className="py-3 px-4">No. Antrean</th>
                  <th className="py-3 px-4">Pasien & NIK</th>
                  <th className="py-3 px-4">Poli & Dokter</th>
                  <th className="py-3 px-4">Tgl Periksa</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi Resepsionis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 font-bold">
                      Memuat data booking dari database...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      Belum ada data pendaftaran booking yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id_booking} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-black text-[#1e5f44]">
                        {item.kode_antrean}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {item.pasien?.nama_pasien || "Pasien"}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          NIK: {item.pasien?.nik || "-"}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {item.poli?.nama_poli || "-"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.dokter?.nama_dokter || "-"}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {formatTanggalIndo(item.tanggal_pemeriksaan)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {formatJamIndo(item.tanggal_pemeriksaan)}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            item.status === "Dikonfirmasi"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : item.status === "Dibatalkan"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {item.status === "Menunggu" && (
                            <button
                              disabled={updatingId === item.id_booking}
                              onClick={() => handleUpdateStatus(item.id_booking, "Dikonfirmasi")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              Konfirmasi Hadir
                            </button>
                          )}

                          {item.status !== "Dibatalkan" && (
                            <button
                              disabled={updatingId === item.id_booking}
                              onClick={() => handleUpdateStatus(item.id_booking, "Dibatalkan")}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50"
                            >
                              Tolak
                            </button>
                          )}

                          {item.status === "Dikonfirmasi" && (
                            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                              ✓ Hadir di Loket
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}