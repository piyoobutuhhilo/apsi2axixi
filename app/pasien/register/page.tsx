"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPasienPage() {
  const router = useRouter();

  // State Form
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nama_pasien: "",
    nik: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    alamat: "",
    no_telepon: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // State untuk menampilkan modal pop-up berhasil
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.username || !formData.password || !formData.nama_pasien || !formData.nik) {
      setErrorMsg("Kolom bertanda bintang (*) wajib diisi!");
      return;
    }

    if (formData.nik.length < 16) {
      setErrorMsg("NIK harus berjumlah 16 digit angka!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/pasien/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.message || "Gagal melakukan registrasi");
        return;
      }

      
      localStorage.setItem(
        "user_puskesmas",
        JSON.stringify({
          id_akun: json.data?.id_akun,
          id_pasien: json.data?.id_pasien,
          username: json.data?.username,
          nama: json.data?.nama_pasien,
          role: "PASIEN",
        })
      );

      setRegisteredName(json.data?.nama_pasien || formData.nama_pasien);
     
      setShowModalSuccess(true);
    } catch (err) {
      setErrorMsg("Kendala jaringan saat menghubungi server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1b5d44] flex items-center justify-center p-4 md:p-8 font-sans select-none relative overflow-hidden">
      {}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />

      {}
      <div className="relative z-10 w-full max-w-xl bg-[#d5dde2] rounded-[32px] p-6 md:p-10 shadow-2xl border border-slate-300">
        {}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto bg-[#1b5d44] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow mb-2">
            P
          </div>
          <h2 className="text-2xl font-black text-[#153a2a] tracking-tight">
            Pendaftaran Pasien Baru
          </h2>
          <p className="text-xs text-slate-600">
            Lengkapi data diri Anda untuk membuat rekam medis dan akun antrean online
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs md:text-sm">
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Username Akun *
              </label>
              <input
                type="text"
                name="username"
                placeholder="Contoh: pio2026"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1b5d44]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Kata Sandi *
              </label>
              <input
                type="password"
                name="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1b5d44]"
              />
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Nama Lengkap Pasien *
              </label>
              <input
                type="text"
                name="nama_pasien"
                placeholder="Contoh: Alfio"
                value={formData.nama_pasien}
                onChange={handleChange}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1b5d44]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                NIK (Nomor Induk Kependudukan) *
              </label>
              <input
                type="text"
                name="nik"
                maxLength={16}
                placeholder="16 digit angka sesuai KTP"
                value={formData.nik}
                onChange={handleChange}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-[#1b5d44]"
              />
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1b5d44]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1b5d44] cursor-pointer"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Nomor Telepon / WhatsApp
            </label>
            <input
              type="tel"
              name="no_telepon"
              placeholder="Contoh: 088288228822"
              value={formData.no_telepon}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1b5d44]"
            />
          </div>

          {}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Alamat Domisili
            </label>
            <textarea
              name="alamat"
              rows={2}
              placeholder="Jalan Cupak Tangah..."
              value={formData.alamat}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1b5d44]"
            />
          </div>

          {}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1b5d44] hover:bg-[#154633] text-white font-extrabold py-3.5 rounded-2xl shadow-lg border-b-2 border-black/40 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Mendaftarkan Akun..." : "Daftar Akun Pasien"}
            </button>
          </div>

          {}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Sudah memiliki akun terdaftar?{" "}
              <button
                type="button"
                onClick={() => router.push("/pasien/login")}
                className="font-bold text-[#1b5d44] hover:underline cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </form>
      </div>

      {}
      {showModalSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-300 flex flex-col items-center text-center">
            {}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black mb-4 shadow-inner">
              ✓
            </div>

            <h3 className="text-lg md:text-xl font-black text-[#1b5d44] tracking-tight mb-2">
              Registrasi Berhasil!
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Akun dan data rekam medis pasien atas nama{" "}
              <strong className="text-slate-900 font-bold">{registeredName}</strong> berhasil
              didaftarkan ke sistem Puskesmas Pauh.
            </p>

            <button
              onClick={() => router.push("/pasien/login")}
              className="w-full bg-[#1b5d44] hover:bg-[#154633] text-white font-extrabold text-xs md:text-sm py-3.5 rounded-2xl shadow-md transition active:scale-95 cursor-pointer"
            >
              Masuk ke Akun Pasien
            </button>
          </div>
        </div>
      )}
    </div>
  );
}