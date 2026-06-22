import { motion } from 'motion/react';
import { Upload, SlidersHorizontal, Cpu, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload your CSV',
    description:
      'Drag and drop any CSV file. MTStudio reads your columns instantly so you can pick exactly which text to translate.',
  },
  {
    icon: SlidersHorizontal,
    step: '02',
    title: 'Configure the job',
    description:
      'Select your text column, source language, target African language, and the Gemini model tier that fits your quality vs speed needs.',
  },
  {
    icon: Cpu,
    step: '03',
    title: 'Watch it translate',
    description:
      'A real-time progress bar tracks each row. The engine processes your dataset in parallel using Gemini AI.',
  },
  {
    icon: Download,
    step: '04',
    title: 'Download results',
    description:
      'Preview the translated output in a table, then export the final CSV with the new translation column appended.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section label */}
        <div className="mb-16">
          <span className="text-[11px] font-black uppercase tracking-widest text-accent-500">
            Workflow
          </span>
          <h2 className="mt-2 text-4xl font-black tracking-tighter text-primary-900">
            Four steps from CSV
            <br />
            to translated dataset.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ icon: Icon, step, title, description }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group"
            >
              {/* Step number + icon */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] font-black text-gray-300 tabular-nums">{step}</span>
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors duration-200">
                  <Icon size={18} />
                </div>
              </div>

              <h3 className="font-bold text-base text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
