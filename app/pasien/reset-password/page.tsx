"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPasienPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [ulangiPassword, setUlangiPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLanjutkan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!identifier || !passwordBaru || !ulangiPassword) {
      setErrorMessage("Semua kolom wajib diisi!");
      return;
    }

    if (passwordBaru !== ulangiPassword) {
      setErrorMessage("Konfirmasi Password Baru tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pasien/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          passwordBaru,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal memperbarui password.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Password berhasil diperbarui! Mengalihkan ke login...");
      setTimeout(() => {
        router.push("/pasien/login");
      }, 1200);
    } catch {
      setErrorMessage("Terjadi kendala koneksi ke server.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1e5f44] flex items-center justify-center p-3 md:p-6 font-sans select-none overflow-hidden">
      {}
      <div className="relative w-full h-[94vh] max-w-[98vw] rounded-[36px] overflow-hidden shadow-2xl border-4 border-emerald-400/40 bg-slate-900 flex">
        
        {}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"
            alt="Ruang Tunggu Rumah Sakit"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {}
        <div className="relative z-10 w-full sm:w-[460px] md:w-[500px] h-full bg-[#d8eee5] rounded-r-[55px] p-8 md:p-12 flex flex-col justify-between shadow-2xl">
          
          {}
          <div>
            <button
              onClick={() => router.push("/pasien/login")}
              type="button"
              className="inline-flex items-center space-x-2 bg-[#23533e] hover:bg-[#1b4332] text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-300/40 shadow-md cursor-pointer transition"
            >
              <div className="w-4 h-4 rounded-full bg-white text-[#23533e] flex items-center justify-center font-bold text-[10px]">
                ‹
              </div>
              <span>Kembali</span>
            </button>
          </div>

          {}
          <div className="w-full max-w-sm mx-auto -mt-10">
            {}
            {errorMessage && (
              <div className="mb-4 bg-rose-600/90 text-white text-xs font-semibold px-4 py-2 rounded-xl text-center shadow">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl text-center shadow">
                {successMessage}
              </div>
            )}

            {}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif text-slate-900 leading-snug">
                Perbarui Password
              </h1>
              <h2 className="text-xl md:text-2xl font-serif text-slate-800 leading-snug mt-1">
                Akun Pasien
              </h2>
            </div>

            <form onSubmit={handleLanjutkan} className="space-y-4">
              {}
              <div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan Email atau Nomor Telepon Anda"
                  className="w-full bg-[#eef6f2]/80 border border-slate-400/80 rounded-full px-5 py-3 text-xs md:text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#23533e] shadow-sm transition"
                />
              </div>

              {}
              <div>
                <input
                  type="password"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  placeholder="Password Baru"
                  className="w-full bg-[#eef6f2]/80 border border-slate-400/80 rounded-full px-5 py-3 text-xs md:text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#23533e] shadow-sm transition"
                />
              </div>

              {}
              <div>
                <input
                  type="password"
                  value={ulangiPassword}
                  onChange={(e) => setUlangiPassword(e.target.value)}
                  placeholder="Ulangi Password Baru"
                  className="w-full bg-[#eef6f2]/80 border border-slate-400/80 rounded-full px-5 py-3 text-xs md:text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#23533e] shadow-sm transition"
                />
              </div>

              {}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xs md:text-sm font-extrabold tracking-wider text-slate-900 hover:text-[#23533e] uppercase cursor-pointer transition active:scale-95 disabled:opacity-50"
                >
                  {loading ? "MEMPROSES..." : "LANJUTKAN"}
                </button>
              </div>
            </form>
          </div>

          {}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}