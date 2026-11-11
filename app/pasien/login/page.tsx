"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPasienPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

   
    const formData = new FormData(e.currentTarget);
    const inputIdentifier = (formData.get("username") as string) || username;
    const inputPassword = (formData.get("password") as string) || password;

    if (!inputIdentifier.trim() || !inputPassword.trim()) {
      setErrorMessage("ID Pasien/Email dan Password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pasien/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: inputIdentifier.trim(),
          email: inputIdentifier.trim(),
          password: inputPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal masuk. Cek akun dan password Anda.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user_puskesmas", JSON.stringify(data.pasien));
      router.push("/pasien/dashboard");
    } catch {
      setErrorMessage("Terjadi kendala koneksi ke server database.");
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
              onClick={() => router.push("/")}
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
          <div className="w-full max-w-sm mx-auto -mt-6">
            {}
            {errorMessage && (
              <div className="mb-4 bg-rose-600 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl text-center shadow">
                {errorMessage}
              </div>
            )}

            {}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-serif text-slate-900 leading-snug">
                Selamat Datang,
              </h1>
              <h2 className="text-xl md:text-2xl font-serif text-slate-800 leading-snug mt-1">
                Silakan Masukkan Akun Pasien
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              {}
              <div>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan Id Pasien Anda"
                  className="w-full bg-[#eef6f2]/80 border border-slate-400/80 rounded-full px-5 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#23533e] shadow-sm transition"
                />
              </div>

              {}
              <div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#eef6f2]/80 border border-slate-400/80 rounded-full px-5 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#23533e] shadow-sm transition"
                />
              </div>

              {}
              <div className="flex justify-between items-start text-[11px] pt-1 px-1">
                <div className="leading-tight text-slate-700">
                  <p>Belum Punya Akun?</p>
                  <button
                    type="button"
                    onClick={() => router.push("/pasien/register")}
                    className="font-bold text-slate-900 underline hover:text-emerald-950 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>

                <div className="leading-tight text-right text-slate-700">
                  <p>Lupa Password?</p>
                  <button
                    type="button"
                    onClick={() => router.push("/pasien/reset-password")}
                    className="font-bold text-slate-900 underline hover:text-emerald-950 cursor-pointer"
                  >
                    Reset Password
                  </button>
                </div>
              </div>

              {}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#23533e] hover:bg-[#1b4332] active:scale-95 text-white text-xs font-semibold px-8 py-2.5 rounded-xl shadow-md border border-emerald-400/40 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Memeriksa..." : "Masuk"}
                </button>
              </div>
            </form>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}