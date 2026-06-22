import { ChevronDown, Wand2 } from 'lucide-react';

const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'yo-NG', label: 'Yoruba (Nigeria)' },
  { value: 'sw-TZ', label: 'Swahili (East Africa)' },
  { value: 'ha-NG', label: 'Hausa (Nigeria)' },
  { value: 'ig-NG', label: 'Igbo (Nigeria)' },
  { value: 'fr-FR', label: 'French' },
];

const columns = [
  { value: 'text_content', label: 'text_content' },
  { value: 'description', label: 'description' },
];

const models = [
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
];

export default function EngineConfigForm() {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
          2
        </div>
        <h3 className="font-semibold text-lg text-gray-900">Configuration</h3>
      </div>

      <div className="space-y-4 flex-1">
        {[
          { label: 'Source Language', options: languages, defaultValue: 'en-US' },
          { label: 'Target Language', options: languages, defaultValue: 'yo-NG' },
          { label: 'Column for Translation', options: columns, defaultValue: 'text_content' },
          { label: 'Translation Model', options: models, defaultValue: 'gemini-1.5-flash' },
        ].map(({ label, options, defaultValue }) => (
          <div key={label}>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">
              {label}
            </label>
            <div className="relative">
              <select
                defaultValue={defaultValue}
                className="w-full h-11 bg-white border border-gray-200 rounded-lg px-4 pr-10 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary mt-8 w-full py-3.5 shadow-lg shadow-primary-500/20">
        <Wand2 size={18} />
        <span className="font-bold text-sm tracking-wide">Initialize Translation Engine</span>
      </button>
    </div>
  );
}
