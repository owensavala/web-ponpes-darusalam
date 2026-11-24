'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Email atau password salah.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0F2A24] text-[#F2EEE3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-islamic-pattern relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-[#173B32] border-2 border-[#D8C28A] flex items-center justify-center text-[#D8C28A] shadow-xl group-hover:scale-105 transition">
            <BookOpen className="w-6 h-6" />
          </div>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          PORTAL OPERATOR & ADMIN
        </h1>
        <p className="text-xs text-[#8FA39B]">
          Yayasan Darussalam Bacan &bull; Pondok Pesantren Kupal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#173B32] border border-[#266052] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <strong className="block text-white">Gagal Masuk:</strong>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#D8C28A] mb-1.5 uppercase tracking-wide">
                Alamat Surel / Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@darussalam.sch.id"
                  required
                  className="w-full px-3.5 py-2.5 pl-10 text-sm rounded-xl border border-[#266052] bg-[#0F2A24] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D8C28A]"
                />
                <Mail className="w-4 h-4 text-[#8FA39B] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D8C28A] mb-1.5 uppercase tracking-wide">
                Kata Sandi / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 pl-10 text-sm rounded-xl border border-[#266052] bg-[#0F2A24] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D8C28A]"
                />
                <Lock className="w-4 h-4 text-[#8FA39B] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="md"
              isLoading={isLoading}
              className="w-full bg-[#D8C28A] text-[#0F2A24] hover:bg-[#C5A55D] font-black mt-2"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Fill Test Accounts (Hanya tampil jika NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS === "true") */}
          {process.env.NEXT_PUBLIC_SHOW_DEMO_ACCOUNTS === 'true' && (
            <div className="pt-4 border-t border-[#266052] space-y-2.5">
              <span className="text-[11px] font-bold text-[#8FA39B] uppercase tracking-wider block">
                Akun Pengujian Demo (Password: Darussalam2026!):
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('superadmin@darussalambacan.sch.id', 'Darussalam2026!')}
                  className="w-full text-left p-2.5 rounded-xl bg-[#0F2A24] hover:bg-[#081714] border border-[#266052] text-xs transition flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-[#D8C28A] block">1. SUPER_ADMIN (Akses Penuh Yayasan)</span>
                    <span className="text-[10px] text-[#8FA39B]">superadmin@darussalambacan.sch.id</span>
                  </div>
                  <span className="text-[10px] bg-[#173B32] px-2 py-0.5 rounded text-white font-mono">Pilih</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('admin.smptahfizh@darussalambacan.sch.id', 'Darussalam2026!')}
                  className="w-full text-left p-2.5 rounded-xl bg-[#0F2A24] hover:bg-[#081714] border border-[#266052] text-xs transition flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-emerald-400 block">2. ADMIN_UNIT (Operator SMP Tahfizh)</span>
                    <span className="text-[10px] text-[#8FA39B]">admin.smptahfizh@darussalambacan.sch.id</span>
                  </div>
                  <span className="text-[10px] bg-[#173B32] px-2 py-0.5 rounded text-white font-mono">Pilih</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('panitia.psb@darussalambacan.sch.id', 'Darussalam2026!')}
                  className="w-full text-left p-2.5 rounded-xl bg-[#0F2A24] hover:bg-[#081714] border border-[#266052] text-xs transition flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-amber-400 block">3. PANITIA_PSB (Verifikasi & Export)</span>
                    <span className="text-[10px] text-[#8FA39B]">panitia.psb@darussalambacan.sch.id</span>
                  </div>
                  <span className="text-[10px] bg-[#173B32] px-2 py-0.5 rounded text-white font-mono">Pilih</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-[#8FA39B] hover:text-[#D8C28A] transition font-medium"
          >
            ← Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
