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

  const [editJamTarget, setEditJamTarget] = useState<{ id_jadwal: string; jamMulai: string; jamSelesai: string } | null>(null);
  const [loadingEditJam, setLoadingEditJam] = useState(false);

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

  const handleOpenEditJam = (id_jadwal: string, currentJam: string) => {
    let mulai = "08.00";
    let selesai = "14.00";
    if (currentJam && currentJam.includes("-")) {
      const parts = currentJam.split("-");
      mulai = parts[0]?.trim() || "08.00";
      selesai = parts[1]?.trim() || "14.00";
    }
    setEditJamTarget({ id_jadwal, jamMulai: mulai, jamSelesai: selesai });
  };

  const handleSimpanEditJam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJamTarget) return;

    try {
      setLoadingEditJam(true);
      await fetch("/api/jadwal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_jadwal: editJamTarget.id_jadwal,
          jam_mulai: editJamTarget.jamMulai.trim().replace(".", ":"),
          jam_selesai: editJamTarget.jamSelesai.trim().replace(".", ":"),
        }),
      });
      setEditJamTarget(null);
      await fetchJadwal();
    } catch (err) {
      alert("Gagal memperbarui jam kerja dokter!");
    } finally {
      setLoadingEditJam(false);
    }
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
                        className="w-5 h-5 rounded-full bg-white text-[#23533e] flex items-center justify-center font-bold text-xs hover:bg-emerald-100 cursor-pointer"
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
                            className="text-slate-500 hover:text-red-600 transition cursor-pointer"
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
                            onClick={() => handleOpenEditJam(item.id_jadwal, item.jam)}
                            className="bg-[#fef08a] hover:bg-[#fde047] text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow cursor-pointer transition active:scale-95"
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

      {editJamTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#e2f0e9] rounded-3xl p-6 shadow-2xl border-2 border-slate-300 flex flex-col items-center relative">
            <button
              onClick={() => setEditJamTarget(null)}
              className="absolute top-3 right-4 font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ✕
            </button>
            <div className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-800 text-xs font-semibold py-2 rounded-full text-center mb-4">
              Edit Jam Kerja Dokter
            </div>
            <form onSubmit={handleSimpanEditJam} className="w-full flex flex-col items-center gap-3">
              <div className="w-full flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-600 pl-2">Jam Mulai Praktek</span>
                <input
                  type="text"
                  autoFocus
                  value={editJamTarget.jamMulai}
                  onChange={(e) => setEditJamTarget({ ...editJamTarget, jamMulai: e.target.value })}
                  placeholder="08.00"
                  className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-900 text-xs text-center py-2.5 rounded-full font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#20674f]"
                />
              </div>

              <div className="w-full flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-600 pl-2">Jam Selesai Praktek</span>
                <input
                  type="text"
                  value={editJamTarget.jamSelesai}
                  onChange={(e) => setEditJamTarget({ ...editJamTarget, jamSelesai: e.target.value })}
                  placeholder="14.00"
                  className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-900 text-xs text-center py-2.5 rounded-full font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#20674f]"
                />
              </div>

              <div className="flex gap-2 w-full justify-center mt-2">
                <button
                  type="button"
                  onClick={() => setEditJamTarget(null)}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-[11px] font-extrabold px-5 py-2 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingEditJam}
                  className="bg-[#48de59] hover:bg-[#3ec44d] text-[#14532d] text-[11px] font-extrabold px-6 py-2 rounded-lg cursor-pointer transition active:scale-95 disabled:opacity-50"
                >
                  {loadingEditJam ? "Menyimpan..." : "Simpan Jam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#e2f0e9] rounded-3xl p-6 shadow-2xl border-2 border-slate-300 flex flex-col items-center">
            <div className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-800 text-xs font-semibold py-2 rounded-full text-center mb-6">
              Yakin Hapus Jadwal Dokter
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <button
                onClick={confirmHapusJadwal}
                className="w-44 bg-[#48de59] hover:bg-[#3ec44d] text-slate-900 text-[11px] font-extrabold py-1.5 rounded-sm shadow cursor-pointer"
              >
                Ya
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-44 bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11px] font-extrabold py-1.5 rounded-sm shadow cursor-pointer"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {modalStep === "HARI" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#e2f0e9] rounded-3xl p-6 shadow-2xl border-2 border-slate-300 flex flex-col items-center relative">
            <button onClick={() => setModalStep(null)} className="absolute top-3 right-4 font-bold text-slate-600 cursor-pointer">✕</button>
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
                className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-900 text-xs text-center py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#20674f]"
              />
              <button type="submit" className="bg-[#48de59] hover:bg-[#3ec44d] text-[#14532d] text-[11px] font-extrabold px-6 py-1.5 rounded-lg cursor-pointer">
                Tambahkan Jadwal
              </button>
            </form>
          </div>
        </div>
      )}

      {modalStep === "JAM" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#e2f0e9] rounded-3xl p-6 shadow-2xl border-2 border-slate-300 flex flex-col items-center relative">
            <button onClick={() => setModalStep(null)} className="absolute top-3 right-4 font-bold text-slate-600 cursor-pointer">✕</button>
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
                className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-900 text-xs text-center py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#20674f]"
              />
              <input
                type="text"
                value={inputJam2}
                onChange={(e) => setInputJam2(e.target.value)}
                placeholder="17.00"
                className="w-full bg-[#d3d7d8] border border-slate-400 text-slate-900 text-xs text-center py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#20674f]"
              />
              <button type="submit" className="bg-[#48de59] hover:bg-[#3ec44d] text-[#14532d] text-[11px] font-extrabold px-6 py-1.5 rounded-lg mt-1 cursor-pointer">
                Perbarui Jadwal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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