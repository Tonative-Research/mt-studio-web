import { motion } from 'motion/react';

const languages = [
  { name: 'English', region: 'Global', code: 'en' },
  { name: 'French', region: 'Global / Africa', code: 'fr' },
  { name: 'Lingala', region: 'DRC / Congo', code: 'ln' },
  { name: 'Luo', region: 'Kenya / Uganda', code: 'luo' },
  { name: 'Kikuyu', region: 'Kenya', code: 'ki' },
  { name: 'Maasai', region: 'Kenya / Tanzania', code: 'mas' },
  { name: 'Swahili', region: 'East Africa', code: 'sw' },
  { name: 'Chichewa', region: 'Malawi / Zambia', code: 'ny' },
  { name: 'Efik', region: 'Nigeria', code: 'efi' },
  { name: 'Fula', region: 'West Africa', code: 'ff' },
  { name: 'Hausa', region: 'Nigeria / Niger', code: 'ha' },
  { name: 'Ibibio', region: 'Nigeria', code: 'ibb' },
  { name: 'Igbo', region: 'Nigeria', code: 'ig' },
  { name: 'Kanuri', region: 'Nigeria / Chad', code: 'kr' },
  { name: 'Nigerian Pidgin', region: 'Nigeria', code: 'pcm' },
  { name: 'Yoruba', region: 'Nigeria', code: 'yo' },
  { name: 'Kinyarwanda', region: 'Rwanda', code: 'rw' },
  { name: 'Luganda', region: 'Uganda', code: 'lg' },
  { name: 'Lusoga', region: 'Uganda', code: 'xog' },
];

export default function SupportedLanguages() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-14">
          <span className="text-[11px] font-black uppercase tracking-widest text-accent-500">
            Language Support
          </span>
          <h2 className="mt-2 text-4xl font-black tracking-tighter text-primary-900">
            Built for African languages,
            <br />
            <span className="text-primary-500">starting with the most spoken.</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl text-sm leading-relaxed">
            MTStudio is designed to grow. The MVP targets the highest-resource
            African languages first, with community contributions opening the
            door to hundreds more.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {languages.map(({ name, region, code }, i) => (
            <motion.div
              key={code}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={`
                rounded-xl border p-4 flex flex-col gap-1
                ${code === '…'
                  ? 'border-dashed border-gray-200 bg-gray-50'
                  : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-sm'}
                transition-all duration-150
              `}
            >
              <span className={`text-xs font-black tabular-nums ${code === '…' ? 'text-gray-300' : 'text-primary-300'}`}>
                {code.toUpperCase()}
              </span>
              <span className={`text-sm font-bold ${code === '…' ? 'text-gray-400' : 'text-gray-800'}`}>
                {name}
              </span>
              <span className="text-[10px] text-gray-400 leading-tight">{region}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
