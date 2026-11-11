"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface SesiJadwal {
  hari: string;
  jam: string;
}

interface DokterCardItem {
  id: string;
  nama: string;
  fotoUrl: string;
  jadwal: SesiJadwal[];
}


function formatTime(val: any): string {
  if (!val) return "08.00";
  if (typeof val === "string") {
    if (val.includes("T")) {
      const timePart = val.split("T")[1]?.slice(0, 5);
      return timePart ? timePart.replace(":", ".") : val;
    }
    return val.slice(0, 5).replace(":", ".");
  }
  if (val instanceof Date) {
    return val.toISOString().split("T")[1]?.slice(0, 5).replace(":", ".");
  }
  return String(val);
}


const fotoDokterMap: Record<string, string> = {
  "dr. Falzan": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
  "dr. Clara": "https://images.unsplash.com/photo-1594824813639-50df73458bfb?q=80&w=400&auto=format&fit=crop",
  "drg. Ziyn": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
  "dr. Rian Pratama": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
  "dr. Siti Rahma, Sp.OG": "https://images.unsplash.com/photo-1594824813639-50df73458bfb?q=80&w=400&auto=format&fit=crop",
  "dr. Budi Santoso, Sp.PD": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
};

function KontenJadwalPasien() {
  const router = useRouter();
  const params = useParams();
  const idPoli = typeof params?.idPoli === "string" ? params.idPoli.toLowerCase() : "anak";

  const [dokterList, setDokterList] = useState<DokterCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatNamaPoli = (key: string) => {
    switch (key) {
      case "anak": return "Poli Anak";
      case "gigi": return "Poli Gigi";
      case "umum": return "Poli Umum";
      case "kandungan": return "Poli Kandungan";
      case "penyakit-dalam": return "Poli Penyakit Dalam";
      default: return `Poli ${key.toUpperCase()}`;
    }
  };

  useEffect(() => {
    async function loadJadwal() {
      try {
        setLoading(true);
        const res = await fetch(`/api/jadwal?poli=${idPoli}`);
        const result = await res.json();

        if (result.data && result.data.length > 0) {
         
          const grouped: Record<string, DokterCardItem> = {};

          result.data.forEach((item: any) => {
            const dokId = item.id_dokter || item.dokter?.id_dokter || item.id_jadwal;
            const dokNama = item.dokter?.nama_dokter || item.dokter?.nama || item.nama || "dr. Dokter Puskesmas";
            const foto =
              fotoDokterMap[dokNama] ||
              item.dokter?.fotoUrl ||
              "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop";

            const mulaiFormatted = formatTime(item.jam_mulai);
            const selesaiFormatted = formatTime(item.jam_selesai);
            const jamDisplay = `${mulaiFormatted}-${selesaiFormatted}`;

            if (!grouped[dokId]) {
              grouped[dokId] = {
                id: dokId,
                nama: dokNama,
                fotoUrl: foto,
                jadwal: [],
              };
            }

            grouped[dokId].jadwal.push({
              hari: item.hari,
              jam: jamDisplay,
            });
          });

          setDokterList(Object.values(grouped));
        } else {
          setDokterList([]);
        }
      } catch (err) {
        console.error("Gagal memuat jadwal:", err);
      } finally {
        setLoading(false);
      }
    }

    loadJadwal();
  }, [idPoli]);

  return (
    <div className="relative min-h-screen w-full bg-[#20674f] text-gray-800 overflow-hidden flex flex-col font-sans select-none p-5 md:p-8">
      {}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-48 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      {}
      <div className="relative z-10 w-full mb-4">
        <button onClick={() => router.back()}>
          <div className="w-5 h-5 rounded-full bg-white text-[#20674f] flex items-center justify-center font-bold text-xs">
            ‹
          </div>
          <span>Kembali</span>
        </button>
      </div>

      {}
      <div className="relative z-10 w-full mb-3">
        <div className="w-full bg-[#3ea870] text-white font-bold text-sm md:text-base py-3 px-8 rounded-full shadow-lg border-b-4 border-[#1e4a36]">
          {formatNamaPoli(idPoli)}
        </div>
      </div>

      {}
      <div className="relative z-10 w-full flex-1 bg-[#d5dde2] rounded-[32px] p-6 md:p-10 shadow-2xl flex flex-col space-y-6 overflow-y-auto">
        {loading ? (
          <div className="text-center py-16 text-slate-600 font-bold text-sm">
            Memuat jadwal praktek dokter dari sistem...
          </div>
        ) : dokterList.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-semibold text-sm">
            Tidak ada jadwal praktek dokter yang tersedia pada poli ini.
          </div>
        ) : (
          dokterList.map((dok) => (
            <div
              key={dok.id}
              className="flex flex-col sm:flex-row items-center gap-5 w-full"
            >
              {}
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#23533e] bg-white overflow-hidden shadow-lg flex-shrink-0 flex items-center justify-center">
                <img
                  src={dok.fotoUrl}
                  alt={dok.nama}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {}
              <div className="flex-1 w-full flex flex-col">
                {}
                <div className="self-start w-full max-w-md bg-[#23533e] text-white font-serif font-bold text-base md:text-lg px-6 py-2 rounded-full shadow-md -mb-2 z-10 border border-emerald-900/60">
                  {dok.nama}
                </div>

                {}
                <div className="w-full bg-[#82cfa5] border border-[#52b788] rounded-3xl p-4 shadow-md flex flex-col sm:flex-row gap-4 justify-between items-stretch">
                  {}
                  <div className="w-full sm:w-5/12 flex flex-col">
                    <div className="bg-[#4aa174] text-white text-xs font-bold py-1.5 px-4 rounded-xl flex items-center justify-center shadow-sm mb-2">
                      <span>Hari</span>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      {dok.jadwal.map((j, idx) => (
                        <div
                          key={idx}
                          className="bg-white/90 border border-slate-300 rounded-xl px-4 py-1.5 text-xs font-bold text-slate-800 text-center shadow-sm h-[32px] flex items-center justify-center"
                        >
                          {j.hari}
                        </div>
                      ))}
                    </div>
                  </div>

                  {}
                  <div className="w-full sm:w-7/12 flex flex-col">
                    <div className="bg-[#4aa174] text-white text-xs font-bold py-1.5 px-4 rounded-xl flex items-center justify-center shadow-sm mb-2">
                      <span>Jam Layanan</span>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      {dok.jadwal.map((j, idx) => (
                        <div
                          key={idx}
                          className="bg-white/90 border border-slate-300 rounded-xl px-4 py-1.5 text-xs font-bold text-slate-800 text-center shadow-sm h-[32px] flex items-center justify-center"
                        >
                          {j.jam}
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
    </div>
  );
}

export default function DetailJadwalPasienPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#20674f] flex items-center justify-center text-white text-sm">
          Memuat data jadwal dokter...
        </div>
      }
    >
      <KontenJadwalPasien />
    </Suspense>
  );
}   