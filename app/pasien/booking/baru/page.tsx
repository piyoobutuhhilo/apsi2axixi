"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface JadwalItem {
  id_jadwal: string;
  hari: string;
  jam: string;
  label: string;
}

interface DokterItem {
  id_dokter: string;
  nama_dokter: string;
  jadwal: JadwalItem[];
}

interface PoliItem {
  id_poli: string;
  nama_poli: string;
  daftar_dokter: DokterItem[];
}

function FormBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit"); 

  const [dataPoli, setDataPoli] = useState<PoliItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

 
  const [selectedPoli, setSelectedPoli] = useState<PoliItem | null>(null);
  const [selectedDokter, setSelectedDokter] = useState<DokterItem | null>(null);
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalItem | null>(null);

 
  const [openDropdown, setOpenDropdown] = useState<"poli" | "dokter" | "jadwal" | null>(null);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [modalSukses, setModalSukses] = useState<{ kode: string; isEdit: boolean } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingData(true);
        const res = await fetch("/api/pasien/booking/options");
        const json = await res.json();

        if (json.data) {
          setDataPoli(json.data);

          
          if (editId) {
            const resRiwayat = await fetch("/api/pasien/booking/riwayat");
            const jsonRiwayat = await resRiwayat.json();
            const existing = jsonRiwayat.data?.find((b: any) => b.id_booking === editId);

            if (existing) {
              const matchedPoli = json.data.find((p: any) => p.id_poli === existing.id_poli);
              if (matchedPoli) {
                setSelectedPoli(matchedPoli);
                const matchedDokter = matchedPoli.daftar_dokter.find(
                  (d: any) => d.id_dokter === existing.id_dokter
                );
                if (matchedDokter) {
                  setSelectedDokter(matchedDokter);
                  const matchedJadwal = matchedDokter.jadwal.find(
                    (j: any) => j.id_jadwal === existing.id_jadwal
                  );
                  if (matchedJadwal) {
                    setSelectedJadwal(matchedJadwal);
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Gagal load opsi:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadOptions();
  }, [editId]);

  const handleSelectPoli = (poli: PoliItem) => {
    setSelectedPoli(poli);
    setSelectedDokter(null);
    setSelectedJadwal(null);
    setOpenDropdown(null);
  };

  const handleSelectDokter = (dokter: DokterItem) => {
    setSelectedDokter(dokter);
    setSelectedJadwal(null);
    setOpenDropdown(null);
  };

  const handleSelectJadwal = (jadwal: JadwalItem) => {
    setSelectedJadwal(jadwal);
    setOpenDropdown(null);
  };

  
  const handleResetFormBooking = () => {
    setSelectedPoli(null);
    setSelectedDokter(null);
    setSelectedJadwal(null);
    setOpenDropdown(null);
    setModalSukses(null);
    if (editId) {
      router.replace("/pasien/booking/baru");
    }
  };

  
  const handleSubmitBooking = async () => {
    if (!selectedPoli) return alert("Silakan pilih Poli Tujuan terlebih dahulu!");
    if (!selectedDokter) return alert("Silakan pilih Dokter terlebih dahulu!");
    if (!selectedJadwal) return alert("Silakan pilih Jadwal Praktek terlebih dahulu!");

    let namaPasienLogin = "";
    let usernamePasienLogin = "";
    let idAkunLogin = "";
    let idPasienLogin = "";

    try {
      const rawStored =
        localStorage.getItem("user_puskesmas") ||
        localStorage.getItem("user") ||
        localStorage.getItem("data_pasien");

      if (rawStored) {
        const parsed = JSON.parse(rawStored);
        namaPasienLogin = parsed.nama || parsed.name || parsed.nama_pasien || "";
        usernamePasienLogin = parsed.username || "";
        idAkunLogin = parsed.id_akun || parsed.id || parsed.user_id || "";
        idPasienLogin = parsed.id_pasien || "";
      }
    } catch (e) {
      console.error("Gagal membaca storage:", e);
    }

    try {
      setLoadingSubmit(true);

      const endpoint = "/api/pasien/booking";
      const method = editId ? "PUT" : "POST";

      const payload: any = {
        id_poli: selectedPoli.id_poli,
        id_dokter: selectedDokter.id_dokter,
        id_jadwal: selectedJadwal.id_jadwal,
        id_pasien: idPasienLogin,
        id_akun: idAkunLogin,
        nama_pasien: namaPasienLogin,
        username_pasien: usernamePasienLogin,
      };

      if (editId) {
        payload.id_booking = editId;
      }

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        alert(resJson.message || "Gagal memproses booking");
        return;
      }

      setModalSukses({
        kode: resJson.data?.kode_antrean || editId || "TERDAFTAR",
        isEdit: Boolean(editId),
      });
    } catch (err) {
      alert("Terjadi kendala jaringan saat menyimpan booking!");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1b5d44] text-gray-900 overflow-hidden flex flex-col font-sans select-none p-5 md:p-8">
      {}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-48 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      {/* Tombol Kembali */}
      <div className="relative z-10 w-full mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 bg-white/15 hover:bg-white/25 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/25 shadow-md transition cursor-pointer backdrop-blur-sm"
        >
          <div className="w-5 h-5 rounded-full bg-white text-[#1b5d44] flex items-center justify-center font-bold text-xs">
            ‹
          </div>
          <span>Kembali</span>
        </button>
      </div>

      {}
      <div
        ref={containerRef}
        className="relative z-10 w-full flex-1 bg-[#d5dde2] rounded-[32px] p-6 md:p-10 shadow-2xl flex flex-col justify-between overflow-visible"
      >
        <div className="w-full flex flex-col space-y-4">
          {}
          {editId && (
            <div className="w-full bg-amber-100 border border-amber-300 text-amber-800 font-bold text-xs px-5 py-2.5 rounded-full shadow-sm">
              ✏️ Mengedit Jadwal Booking: <span className="font-mono">{editId}</span>
            </div>
          )}

          {}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "poli" ? null : "poli")}
              className={`w-full bg-[#3ea870] hover:bg-[#389865] text-slate-900 font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-full border-b-4 border-[#143d2c] shadow-md flex items-center justify-between transition cursor-pointer ${
                openDropdown === "poli" ? "rounded-b-none" : ""
              }`}
            >
              <span>{selectedPoli ? selectedPoli.nama_poli : "Pilih Poli Tujuan"}</span>
              <span
                className={`text-sm transform transition-transform duration-200 ${
                  openDropdown === "poli" ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openDropdown === "poli" && (
              <div className="absolute top-full left-0 w-full bg-[#3ea870] border-t border-emerald-700/30 border-b-4 border-[#143d2c] rounded-b-2xl shadow-xl z-30 py-2 flex flex-col max-h-56 overflow-y-auto">
                {loadingData ? (
                  <div className="px-6 py-2.5 text-xs font-semibold text-emerald-950">
                    Memuat data poli...
                  </div>
                ) : (
                  dataPoli.map((p) => (
                    <button
                      key={p.id_poli}
                      type="button"
                      onClick={() => handleSelectPoli(p)}
                      className="w-full text-left px-6 py-2.5 text-xs md:text-sm font-bold text-slate-900 hover:bg-[#348e5e] transition cursor-pointer"
                    >
                      {p.nama_poli}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {}
          <div className="relative w-full">
            <button
              type="button"
              disabled={!selectedPoli}
              onClick={() => setOpenDropdown(openDropdown === "dokter" ? null : "dokter")}
              className={`w-full ${
                !selectedPoli
                  ? "bg-[#3ea870]/60 opacity-80 cursor-not-allowed"
                  : "bg-[#3ea870] hover:bg-[#389865] cursor-pointer"
              } text-slate-900 font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-full border-b-4 border-[#143d2c] shadow-md flex items-center justify-between transition ${
                openDropdown === "dokter" ? "rounded-b-none" : ""
              }`}
            >
              <span>
                {selectedDokter
                  ? selectedDokter.nama_dokter
                  : selectedPoli
                  ? "Pilih Dokter"
                  : "Pilih Dokter (Pilih Poli Terlebih Dahulu)"}
              </span>
              <span
                className={`text-sm transform transition-transform duration-200 ${
                  openDropdown === "dokter" ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openDropdown === "dokter" && selectedPoli && (
              <div className="absolute top-full left-0 w-full bg-[#3ea870] border-t border-emerald-700/30 border-b-4 border-[#143d2c] rounded-b-2xl shadow-xl z-20 py-2 flex flex-col max-h-56 overflow-y-auto">
                {selectedPoli.daftar_dokter.length === 0 ? (
                  <div className="px-6 py-2.5 text-xs font-semibold text-emerald-950">
                    Tidak ada dokter praktek di poli ini.
                  </div>
                ) : (
                  selectedPoli.daftar_dokter.map((d) => (
                    <button
                      key={d.id_dokter}
                      type="button"
                      onClick={() => handleSelectDokter(d)}
                      className="w-full text-left px-6 py-2.5 text-xs md:text-sm font-bold text-slate-900 hover:bg-[#348e5e] transition cursor-pointer"
                    >
                      {d.nama_dokter}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {}
          <div className="relative w-full">
            <button
              type="button"
              disabled={!selectedDokter}
              onClick={() => setOpenDropdown(openDropdown === "jadwal" ? null : "jadwal")}
              className={`w-full ${
                !selectedDokter
                  ? "bg-[#3ea870]/60 opacity-80 cursor-not-allowed"
                  : "bg-[#3ea870] hover:bg-[#389865] cursor-pointer"
              } text-slate-900 font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-full border-b-4 border-[#143d2c] shadow-md flex items-center justify-between transition ${
                openDropdown === "jadwal" ? "rounded-b-none" : ""
              }`}
            >
              <span>
                {selectedJadwal
                  ? selectedJadwal.label
                  : selectedDokter
                  ? "Pilih Jadwal"
                  : "Pilih Jadwal (Pilih Dokter Terlebih Dahulu)"}
              </span>
              <span
                className={`text-sm transform transition-transform duration-200 ${
                  openDropdown === "jadwal" ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openDropdown === "jadwal" && selectedDokter && (
              <div className="absolute top-full left-0 w-full bg-[#3ea870] border-t border-emerald-700/30 border-b-4 border-[#143d2c] rounded-b-2xl shadow-xl z-10 py-2 flex flex-col max-h-56 overflow-y-auto">
                {selectedDokter.jadwal.length === 0 ? (
                  <div className="px-6 py-2.5 text-xs font-semibold text-emerald-950">
                    Tidak ada jadwal praktek tersedia.
                  </div>
                ) : (
                  selectedDokter.jadwal.map((j) => (
                    <button
                      key={j.id_jadwal}
                      type="button"
                      onClick={() => handleSelectJadwal(j)}
                      className="w-full text-left px-6 py-2.5 text-xs md:text-sm font-bold text-slate-900 hover:bg-[#348e5e] transition cursor-pointer"
                    >
                      {j.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {}
        <div className="w-full flex justify-end mt-12">
          <button
            type="button"
            disabled={loadingSubmit}
            onClick={handleSubmitBooking}
            className={`${
              editId ? "bg-amber-600 hover:bg-amber-700" : "bg-[#173e2d] hover:bg-[#112d21]"
            } text-white font-extrabold text-xs md:text-sm px-8 py-3 rounded-2xl shadow-lg border-b-2 border-black/40 transition active:scale-95 cursor-pointer disabled:opacity-50`}
          >
            {loadingSubmit ? "Menyimpan..." : editId ? "Simpan Perubahan Jadwal" : "Buat Booking"}
          </button>
        </div>
      </div>

      {}
      {modalSukses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-emerald-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-4">
              ✓
            </div>
            <h3 className="text-lg font-black text-[#1b5d44] mb-1">
              {modalSukses.isEdit ? "Jadwal Berhasil Diperbarui!" : "Booking Berhasil!"}
            </h3>
            <p className="text-xs text-slate-600 mb-2">
              {modalSukses.isEdit
                ? "Perubahan jadwal kunjungan Anda telah disimpan ke sistem."
                : "Jadwal pemeriksaan berhasil dibuat. Simpan kode antrean Anda:"}
            </p>

            {!modalSukses.isEdit && (
              <div className="my-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-lg font-black text-[#1b5d44]">
                {modalSukses.kode}
              </div>
            )}

            {}
            <div className="w-full flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={handleResetFormBooking}
                className="w-full bg-[#1b5d44] hover:bg-[#154633] text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer shadow-md active:scale-95"
              >
                + Buat Booking Jadwal Lain
              </button>

              <button
                type="button"
                onClick={() => router.push("/pasien/antrean/cetak")}
                className="w-full bg-emerald-100 hover:bg-emerald-200 text-[#1b5d44] font-bold text-xs py-2.5 rounded-xl transition cursor-pointer border border-emerald-300"
              >
                Cetak Tiket Antrean Sekarang
              </button>

              <button
                type="button"
                onClick={() => router.push("/pasien/booking/riwayat")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                Lihat Riwayat Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuatBookingBaruPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1b5d44] text-white flex items-center justify-center font-bold">
          Memuat Formulir Booking...
        </div>
      }
    >
      <FormBookingContent />
    </Suspense>
  );
}