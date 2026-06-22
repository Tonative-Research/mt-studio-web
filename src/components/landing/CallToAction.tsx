import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function CallToAction() {
  return (
    <section className="py-24 bg-primary-900 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-accent-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[11px] font-black uppercase tracking-widest text-accent-400 mb-4 block">
            Ready to start?
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-5">
            Translate your first
            <br />
            dataset in minutes.
          </h2>
          <p className="text-white/40 text-base mb-10 leading-relaxed">
            No account needed for the MVP. Drop your CSV, configure the job, and
            let Gemini do the work.
          </p>

          <Button
            variant="accent"
            size="lg"
            trailingIcon={<ArrowRight size={16} />}
            className="shadow-2xl shadow-accent-500/30 font-black uppercase tracking-widest"
            onClick={() => window.location.href = '/dashboard'}
          >
            Open MT Studio
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
