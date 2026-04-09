import React, { useState } from "react";
import { getApiBase } from "../services/api";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Mail,
  User,
  FileText,
  MessageSquare,
  X,
} from "lucide-react";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${getApiBase()}/contact.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
        setHoneypot("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Bir hata oluştu");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            İletişim
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Mesajınız Gönderildi!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                En kısa sürede size dönüş yapacağım.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
              >
                Yeni Mesaj Gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot - hidden from users (avoid browser autofill) */}
              <input
                type="text"
                name="contact_fax"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="new-password"
                inputMode="none"
                spellCheck={false}
                aria-hidden="true"
                data-lpignore="true"
                data-1p-ignore="true"
                style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <User className="w-4 h-4" />
                    İsim
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    placeholder="Adınız"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <Mail className="w-4 h-4" />
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <FileText className="w-4 h-4" />
                  Konu
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                  placeholder="İletişimin konusu (opsiyonel)"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <MessageSquare className="w-4 h-4" />
                  Mesaj
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                  placeholder="Mesajınızı yazın..."
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {form.message.length}/5000
                </p>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
              >
                {status === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gönder
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
