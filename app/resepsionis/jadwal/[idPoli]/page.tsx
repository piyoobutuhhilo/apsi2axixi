"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface SesiJadwal {
  id_jadwal: string;
  hari: string;
  jam: string;
}

interface JadwalDokter {
  id: string;
  nama: string;
  fotoUrl: string;
  jadwal: SesiJadwal[];
}

function formatTime(val: any): string {
  if (!val) return "08.00";
  if (typeof val === "string") {
    if (val.includes("T")) {
      return val.split("T")[1]?.slice(0, 5).replace(":", ".") || "08.00";
    }
    return val.slice(0, 5).replace(":", ".");
  }
  if (val instanceof Date) {
    return val.toISOString().split("T")[1]?.slice(0, 5).replace(":", ".");
  }
  return String(val);
}

const idPoliDbMap: Record<string, string> = {
  anak: "POL001",
  gigi: "POL002",
  umum: "POL003",
  kandungan: "POL004",
  "penyakit-dalam": "POL005",
};

// Komponen Anak: Semua hooks ditaruh di sini
function JadwalDetailContent() {
  const router = useRouter();
  const params = useParams();
  const idPoli = typeof params?.idPoli === "string" ? params.idPoli.toLowerCase() : "anak";
  const idDbPoli = idPoliDbMap[idPoli] || "POL001";

  const [dokterList, setDokterList] = useState<JadwalDokter[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeDokterId, setActiveDokterId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<"HARI" | "JAM" | null>(null);
  const [inputHari, setInputHari] = useState("");
  const [inputJam1, setInputJam1] = useState("");
  const [inputJam2, setInputJam2] = useState("17.00");

  const [deleteTarget, setDeleteTarget] = useState<{ id_jadwal: string } | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/jadwal?poli=${idPoli}`, { cache: "no-store" });
      const json = await res.json();

      if (json.data && json.data.length > 0) {
        const grouped: Record<string, JadwalDokter> = {};
        json.data.forEach((row: any) => {
          const dokId = row.id_dokter || row.dokter?.id_dokter;
          const dokNama = row.dokter?.nama_dokter || row.nama || "Dokter";
          const dokFoto =
            row.dokter?.fotoUrl ||
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop";

          const mulai = formatTime(row.jam_mulai);
          const selesai = formatTime(row.jam_selesai);

          if (!grouped[dokId]) {
            grouped[dokId] = { id: dokId, nama: dokNama, fotoUrl: dokFoto, jadwal: [] };
          }
          grouped[dokId].jadwal.push({
            id_jadwal: row.id_jadwal,
            hari: row.hari,
            jam: `${mulai}-${selesai}`,
          });
        });
        setDokterList(Object.values(grouped));
      } else {
        setDokterList([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [idPoli]);

  const handleSimpanJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDokterId || !inputHari.trim()) return;

    const jMulai = inputJam1.trim() ? inputJam1.trim().replace(".", ":") : "08:00";
    const jSelesai = inputJam2.trim() ? inputJam2.trim().replace(".", ":") : "17:00";

    await fetch("/api/jadwal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_dokter: activeDokterId,
        id_poli: idDbPoli,
        hari: inputHari.trim(),
        jam_mulai: jMulai,
        jam_selesai: jSelesai,
      }),
    });

    setModalStep(null);
    setActiveDokterId(null);
    setInputHari("");
    setInputJam1("");
    await fetchJadwal();
  };

  const confirmHapusJadwal = async () => {
    if (!deleteTarget) return;

    await fetch(`/api/jadwal?id=${deleteTarget.id_jadwal}`, { method: "DELETE" });
    setDeleteTarget(null);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 2000);
    await fetchJadwal();
  };

  const handleEditJam = async (id_jadwal: string, currentJam: string) => {
    const input = prompt("Masukkan format jam baru (contoh: 08.00-14.00):", currentJam);
    if (!input || !input.includes("-")) return;

    const [mulai, selesai] = input.split("-");
    await fetch("/api/jadwal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_jadwal,
        jam_mulai: mulai.trim().replace(".", ":"),
        jam_selesai: selesai.trim().replace(".", ":"),
      }),
    });

    await fetchJadwal();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#20674f] text-gray-800 overflow-hidden flex flex-col font-sans select-none p-5 md:p-8">
      <div className="relative z-10 w-full flex items-center justify-between mb-4 min-h-[46px]">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/30 shadow-md transition cursor-pointer backdrop-blur-sm"
        >
          <div className="w-5 h-5 rounded-full bg-white text-[#20674f] flex items-center justify-center font-bold text-xs">
            ‹
          </div>
          <span>Kembali</span>
        </button>

        {showSuccessBanner && (
          <div className="bg-[#a3f3a8] border border-[#48de59] text-black font-extrabold text-xs md:text-sm px-8 py-2.5 rounded-full shadow-lg">
            Berhasil Hapus Jadwal Dokter!
          </div>
        )}
        <div className="w-20" />
      </div>

      <div className="relative z-10 w-full flex-1 bg-[#d5dde2] rounded-[32px] p-6 md:p-10 shadow-2xl flex flex-col space-y-6 overflow-y-auto">
        {loading ? (
          <div className="text-center py-16 text-slate-600 font-bold text-sm">Menyinkronkan database...</div>
        ) : (
          dokterList.map((dok) => (
            <div key={dok.id} className="flex flex-col sm:flex-row items-center gap-5 w-full">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#23533e] bg-white overflow-hidden shadow-lg flex-shrink-0">
                <img src={dok.fotoUrl} alt={dok.nama} className="w-full h-full object-cover object-top" />
              </div>

              <div className="flex-1 w-full flex flex-col">
                <div className="self-start w-full max-w-md bg-[#23533e] text-white font-serif font-bold text-base md:text-lg px-6 py-2 rounded-full shadow-md -mb-2 z-10">
                  {dok.nama}
                </div>

                <div className="w-full bg-[#82cfa5] border border-[#52b788] rounded-3xl p-4 shadow-md flex flex-col sm:flex-row gap-4 justify-between items-stretch">
                  <div className="w-full sm:w-5/12 flex flex-col">
                    <div className="bg-[#4aa174] text-white text-xs font-bold py-1.5 px-4 rounded-xl flex items-center justify-between mb-2">
                      <span className="mx-auto pl-5">Hari</span>
                      <button
                        onClick={() => {
                          setActiveDokterId(dok.id);
                          setModalStep("HARI");
                        }}
                        className="w-5 h-5 rounded-full bg-white text-[#23533e] flex items-center justify-center font-bold text-xs hover:bg-emerald-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      {dok.jadwal.map((item) => (
                        <div
                          key={item.id_jadwal}
                          className="bg-white/90 border border-slate-300 rounded-xl px-4 py-1.5 text-xs font-bold text-slate-800 flex items-center justify-between shadow-sm h-[32px]"
                        >
                          <span className="flex-1 text-center">{item.hari}</span>
                          <button
                            onClick={() => setDeleteTarget({ id_jadwal: item.id_jadwal })}
                            className="text-slate-500 hover:text-red-600 transition"
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full sm:w-7/12 flex flex-col">
                    <div className="bg-[#4aa174] text-white text-xs font-bold py-1.5 px-4 rounded-xl flex items-center justify-center mb-2">
                      <span>Jam Kerja</span>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      {dok.jadwal.map((item) => (
                        <div
                          key={item.id_jadwal}
                          className="bg-white/90 border border-slate-300 rounded-xl px-3 py-1 text-xs font-bold text-slate-800 flex items-center justify-between shadow-sm h-[32px]"
                        >
                          <span className="flex-1 text-center">{item.jam}</span>
                          <button
                            onClick={() => handleEditJam(item.id_jadwal, item.jam)}
                            className="bg-[#fef08a] hover:bg-[#fde047] text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded shadow"
                          >
                            Edit
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#e2f0e9] rounded-3xl p-6 shadow-2xl border-2 border-slate-300 flex flex-col items-center">
            <div className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-800 text-xs font-semibold py-2 rounded-full text-center mb-6">
              Yakin Hapus Jadwal Dokter
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <button
                onClick={confirmHapusJadwal}
                className="w-44 bg-[#48de59] hover:bg-[#3ec44d] text-slate-900 text-[11px] font-extrabold py-1.5 rounded-sm shadow"
              >
                Ya
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-44 bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11px] font-extrabold py-1.5 rounded-sm shadow"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {modalStep === "HARI" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#e2f0e9] rounded-3xl p-6 shadow-2xl border-2 border-slate-300 flex flex-col items-center relative">
            <button onClick={() => setModalStep(null)} className="absolute top-3 right-4 font-bold text-slate-600">✕</button>
            <div className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-800 text-xs font-semibold py-2 rounded-full text-center mb-4">
              Hari Kerja Baru Dokter
            </div>
            <form onSubmit={(e) => { e.preventDefault(); if (inputHari.trim()) setModalStep("JAM"); }} className="w-full flex flex-col items-center gap-4">
              <input
                type="text"
                autoFocus
                value={inputHari}
                onChange={(e) => setInputHari(e.target.value)}
                placeholder="Masukkan Hari"
                className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-900 text-xs text-center py-4 rounded-2xl"
              />
              <button type="submit" className="bg-[#48de59] hover:bg-[#3ec44d] text-[#14532d] text-[11px] font-extrabold px-6 py-1.5 rounded-lg">
                Tambahkan Jadwal
              </button>
            </form>
          </div>
        </div>
      )}

      {modalStep === "JAM" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#e2f0e9] rounded-3xl p-6 shadow-2xl border-2 border-slate-300 flex flex-col items-center relative">
            <button onClick={() => setModalStep(null)} className="absolute top-3 right-4 font-bold text-slate-600">✕</button>
            <div className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-800 text-xs font-semibold py-2 rounded-full text-center mb-4">
              Jam Kerja Baru Dokter
            </div>
            <form onSubmit={handleSimpanJadwal} className="w-full flex flex-col items-center gap-3">
              <input
                type="text"
                autoFocus
                value={inputJam1}
                onChange={(e) => setInputJam1(e.target.value)}
                placeholder="08.00"
                className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-900 text-xs text-center py-2.5 rounded-full"
              />
              <input
                type="text"
                value={inputJam2}
                onChange={(e) => setInputJam2(e.target.value)}
                placeholder="17.00"
                className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-900 text-xs text-center py-2.5 rounded-full"
              />
              <button type="submit" className="bg-[#48de59] hover:bg-[#3ec44d] text-[#14532d] text-[11px] font-extrabold px-6 py-1.5 rounded-lg mt-1">
                Perbarui Jadwal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Export default HANYA membungkus JadwalDetailContent dengan Suspense
export default function DetailJadwalResepsionisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#20674f] text-white flex items-center justify-center font-bold">
          Memuat Jadwal Dokter...
        </div>
      }
    >
      <JadwalDetailContent />
    </Suspense>
  );
}