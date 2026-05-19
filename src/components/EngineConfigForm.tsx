import { ChevronDown, Wand2 } from 'lucide-react';

const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'yo-NG', label: 'Yoruba (Nigeria)' },
  { value: 'sw-TZ', label: 'Swahili (East Africa)' },
];

const columns = [
  { value: 'text_content', label: 'text_content' },
  { value: 'description', label: 'description' },
];

const models = [
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Preview)' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  { value: 'tonative-1.5-pro', label: 'Tonative Africa 1.5 Pro' },
];

export default function EngineConfigForm() {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
        <h3 className="font-semibold text-lg">Configuration</h3>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 ml-1">
            Source Language
          </label>
          <div className="relative">
            <select className="w-full h-12 bg-surface border border-outline/10 rounded-lg px-4 pr-10 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
              {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 ml-1">
            Target Language
          </label>
          <div className="relative">
            <select className="w-full h-12 bg-surface border border-outline/10 rounded-lg px-4 pr-10 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
              {languages.map(l => <option key={l.value} value={l.value} selected={l.value === 'yo-NG'}>{l.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 ml-1">
            Column for Translation
          </label>
          <div className="relative">
            <select className="w-full h-12 bg-surface border border-outline/10 rounded-lg px-4 pr-10 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
              {columns.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 ml-1">
            Translation Model
          </label>
          <div className="relative">
            <select className="w-full h-12 bg-surface border border-outline/10 rounded-lg px-4 pr-10 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
              {models.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
        </div>
      </div>

      <button className="mt-8 w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg flex items-center justify-center gap-3 transition-transform active:scale-[0.99] shadow-lg">
        <Wand2 size={18} className="text-white/80" />
        <span className="font-bold text-sm tracking-wide">Initialize LinguaBridge Engine</span>
      </button>
    </div>
  );
}
