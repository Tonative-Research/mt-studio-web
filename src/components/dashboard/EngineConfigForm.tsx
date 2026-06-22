import { Wand2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';

const languageOptions = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'yo-NG', label: 'Yoruba (Nigeria)' },
  { value: 'sw-TZ', label: 'Swahili (East Africa)' },
  { value: 'ha-NG', label: 'Hausa (Nigeria)' },
  { value: 'ig-NG', label: 'Igbo (Nigeria)' },
  { value: 'fr-FR', label: 'French' },
];

const columnOptions = [
  { value: 'text_content', label: 'text_content' },
  { value: 'description', label: 'description' },
];

const modelOptions = [
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
        <Select
          label="Source Language"
          options={languageOptions}
          defaultValue="en-US"
        />
        <Select
          label="Target Language"
          options={languageOptions}
          defaultValue="yo-NG"
        />
        <Select
          label="Column for Translation"
          options={columnOptions}
          defaultValue="text_content"
        />
        <Select
          label="Translation Model"
          options={modelOptions}
          defaultValue="gemini-1.5-flash"
        />
      </div>

      <Button
        variant="primary"
        fullWidth
        size="lg"
        leadingIcon={<Wand2 size={18} />}
        className="mt-8 shadow-lg shadow-primary-500/20 font-bold tracking-wide"
      >
        Initialize Translation Engine
      </Button>
    </div>
  );
}
