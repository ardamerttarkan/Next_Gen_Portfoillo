import React, { useState, useEffect, useRef } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { login } from "../services/api";

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
  autoLogin?: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLogin,
  onBack,
  autoLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [shake, setShake] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  // Auto-login if valid session exists
  useEffect(() => {
    if (autoLogin) {
      onLogin();
      return;
    }
  }, [autoLogin]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loaded) usernameRef.current?.focus();
  }, [loaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Lütfen tüm alanları doldurun.");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Kullanıcı adı veya şifre hatalı.");
      setPassword("");
      setLoading(false);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden font-display bg-[#06060e] flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[120px]"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            animation: "float1 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            animation: "float2 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.05] blur-[100px]"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            animation: "float3 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={onBack}
        className={`
          absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full
          bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white
          hover:bg-white/[0.08] hover:border-white/[0.15] backdrop-blur-sm
          transition-all duration-300 text-sm font-medium
          ${loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
        `}
        style={{ transitionDelay: "400ms" }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Geri</span>
      </button>

      {/* Login Card */}
      <div
        className={`
          relative w-full max-w-[420px] mx-4 transition-all duration-700 ease-out
          ${loaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
        `}
      >
        {/* Card Glow */}
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-cyan-500/20 opacity-60 blur-[2px]" />

        {/* Card */}
        <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.07] shadow-2xl overflow-hidden">
          {/* Top Accent Line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            {/* Icon */}
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
              </div>
              {/* Subtle pulse ring */}
              <div
                className="absolute inset-0 rounded-2xl border border-indigo-500/20 animate-ping opacity-20"
                style={{ animationDuration: "3s" }}
              />
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5">
              Admin Girişi
            </h1>
            <p className="text-gray-500 text-sm">
              Yönetim paneline erişmek için giriş yapın
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="admin"
                  autoComplete="username"
                  className={`
                    w-full bg-white/[0.04] border rounded-xl px-4 py-3.5 text-white text-sm
                    placeholder:text-gray-600 outline-none transition-all duration-200
                    focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 focus:bg-white/[0.06]
                    ${error ? "border-red-500/40" : "border-white/[0.08] hover:border-white/[0.15]"}
                    ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}
                  `}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`
                    w-full bg-white/[0.04] border rounded-xl px-4 py-3.5 pr-12 text-white text-sm
                    placeholder:text-gray-600 outline-none transition-all duration-200
                    focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 focus:bg-white/[0.06]
                    ${error ? "border-red-500/40" : "border-white/[0.08] hover:border-white/[0.15]"}
                    ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/[0.06]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 
                flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-indigo-500/50 text-white/70 cursor-wait"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Giriş Yap</span>
                </>
              )}
            </button>

            {/* Hint */}
          </form>
        </div>
      </div>

      {/* Shake Animation Keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};
