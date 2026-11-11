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
    nama_pasien: string;
    nik: string;
    no_telepon: string;
  };
  poli?: {
    id_poli: string;
    nama_poli: string;
  };
  dokter?: {
    nama_dokter: string;
  };
  jadwal?: {
    hari: string;
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

export default function ResepsionisBookingPage() {
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
      let url = `/api/resepsionis/booking?poli=${filterPoli}&status=${filterStatus}`;
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
      alert("Terjadi kendala jaringan!");
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
    <div className="min-h-screen w-full bg-[#f4f7f6] text-gray-800 flex flex-col font-sans select-none">
      {}
      <header className="bg-[#1f5c43] text-white px-6 py-4 flex flex-wrap items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-lg">
            📋
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg leading-tight">
              Portal Resepsionis — Puskesmas Pauh
            </h1>
            <p className="text-xs text-emerald-200">Verifikasi & Konfirmasi Booking Pasien</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/resepsionis/dashboard")}
          className="mt-2 sm:mt-0 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Kembali ke Dashboard
        </button>
      </header>

      {}
      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-6">
        {}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          {}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari Nama Pasien / NIK / Kode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#1f5c43]"
            />
          </div>

          {}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={filterPoli}
              onChange={(e) => setFilterPoli(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#1f5c43] cursor-pointer"
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
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#1f5c43] cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Dikonfirmasi">Dikonfirmasi (Hadir)</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>

            <button
              onClick={fetchBookings}
              className="bg-emerald-50 text-[#1f5c43] border border-emerald-300 hover:bg-emerald-100 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
            >
              Segarkan Data
            </button>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-[#1f5c43] text-white uppercase text-[11px] font-extrabold tracking-wider">
                  <th className="py-3.5 px-4">No. Antrean</th>
                  <th className="py-3.5 px-4">Pasien & NIK</th>
                  <th className="py-3.5 px-4">Poli & Dokter</th>
                  <th className="py-3.5 px-4">Tgl Periksa</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi Resepsionis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 font-bold">
                      Memuat data booking pasien...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      Tidak ada data pendaftaran booking yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id_booking} className="hover:bg-slate-50 transition">
                      {/* Kode Antrean */}
                      <td className="py-3.5 px-4 font-mono font-black text-[#1f5c43]">
                        {item.kode_antrean}
                      </td>

                      {}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {item.pasien?.nama_pasien || "Pasien"}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          NIK: {item.pasien?.nik || "-"}
                        </div>
                      </td>

                      {}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {item.poli?.nama_poli || "-"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.dokter?.nama_dokter || "-"}
                        </div>
                      </td>

                      {}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {formatTanggalIndo(item.tanggal_pemeriksaan)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {formatJamIndo(item.tanggal_pemeriksaan)}
                        </div>
                      </td>

                      {}
                      <td className="py-3.5 px-4">
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

                      {}
                      <td className="py-3.5 px-4 text-center">
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
                              ✓ Siap Diperiksa
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
      </main>
    </div>
  );
}