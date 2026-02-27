import React from "react";

interface BackgroundOrbsProps {
  theme: "personal" | "professional";
}

/**
 * BackgroundOrbs — Tüm sayfalarda tekrarlanan dekoratif arka plan
 * orbları ve grid overlay'ı tek bir bileşende toplar.
 *
 * willChange: "transform" GPU katmanı oluşturarak blur repaint'i önler.
 */
export const BackgroundOrbs: React.FC<BackgroundOrbsProps> = ({ theme }) => {
  const isProf = theme === "professional";

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {isProf ? (
          <>
            <div
              className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.12] blur-[130px]"
              style={{
                background:
                  "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
                willChange: "transform",
              }}
            />
            <div
              className="absolute top-1/2 -left-40 w-[550px] h-[550px] rounded-full opacity-[0.05] dark:opacity-[0.10] blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
                willChange: "transform",
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.15] blur-[140px]"
              style={{
                background:
                  "radial-gradient(circle, #a855f7 0%, transparent 70%)",
                willChange: "transform",
              }}
            />
            <div
              className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.10] blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, #ec4899 0%, transparent 70%)",
                willChange: "transform",
              }}
            />
          </>
        )}
      </div>
      <div className="fixed inset-0 opacity-[0.04] dark:opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
    </>
  );
};
