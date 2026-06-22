import { motion } from "motion/react";
import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary-900 min-h-[92vh] flex items-center">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-white) 1px, transparent 1px), linear-gradient(90deg, var(--color-white) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-accent-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary-400/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 w-full">
        <div className="max-w-3xl">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05] mb-6"
          >
            Translate datasets
            <br />
            <span className="text-accent-400">into African languages.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-lg text-white/50 leading-relaxed max-w-xl mb-10"
          >
            Upload a CSV, pick your column and target language, choose a Gemini
            model, and get high-quality translations at scale. No code required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button
              variant="secondary"
              size="lg"
              trailingIcon={<ArrowRight size={16} />}
              className="shadow-xl shadow-accent-500/25 font-black uppercase tracking-widest"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Start Translating
            </Button>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors"
            >
              <Upload size={15} />
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="mt-20 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/10 pt-10"
        >
          {[
            { value: "500+", label: "African languages targeted" },
            { value: "Gemini", label: "1.5 Flash & Pro supported" },
            { value: "CSV", label: "drag-and-drop upload" },
            { value: "Open", label: "source — contribute soon" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-white/40 mt-0.5 capitalize">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
