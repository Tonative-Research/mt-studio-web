import { Wand2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'ln', label: 'Lingala' },
  { value: 'luo', label: 'Luo' },
  { value: 'ki', label: 'Kikuyu' },
  { value: 'mas', label: 'Maasai' },
  { value: 'sw', label: 'Swahili' },
  { value: 'ny', label: 'Chichewa' },
  { value: 'efi', label: 'Efik' },
  { value: 'ff', label: 'Fula' },
  { value: 'ha', label: 'Hausa' },
  { value: 'ibb', label: 'Ibibio' },
  { value: 'ig', label: 'Igbo' },
  { value: 'kr', label: 'Kanuri' },
  { value: 'pcm', label: 'Nigerian Pidgin' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'rw', label: 'Kinyarwanda' },
  { value: 'lg', label: 'Luganda' },
  { value: 'xog', label: 'Lusoga' },
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
          defaultValue="en"
        />
        <Select
          label="Target Language"
          options={languageOptions}
          defaultValue="yo"
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
