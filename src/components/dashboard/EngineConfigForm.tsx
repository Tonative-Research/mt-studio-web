import { useEffect, useMemo, useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSelectedModel, setAvailableModels } from '@/redux/modelConfigSlice';
import { setSelectedTextColumn, setSourceLanguage, setTargetLanguage, setAvailableLanguages } from '@/redux/uploadSlice';
import { setCurrentJob, setJobStatus, setProgress, setTranslateError } from '@/redux/translateSlice';
import { toast } from '@/redux/toastSlice';
import { useGetModelsQuery } from '@/services/api/model';
import { useGetLanguagesQuery } from '@/services/api/language';
import { useStartTranslationMutation } from '@/services/api/translate';
import { ETranslationStatus } from '@/services/types/translate';
import { saveSession } from '@/utils/sessionStorage';
import type { IGeminiModel } from '@/services/types/model';

const FALLBACK_LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'sw', label: 'Swahili' },
  { value: 'ny', label: 'Chichewa' },
  { value: 'yo', label: 'Yoruba' },
];

const FALLBACK_MODEL_OPTIONS = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
];

export default function EngineConfigForm() {
  const dispatch = useAppDispatch();
  const uploadedFile = useAppSelector((state) => state.upload.uploadedFile);
  const columns = useAppSelector((state) => state.upload.columns ?? []);
  const selectedTextColumn = useAppSelector((state) => state.upload.selectedTextColumn ?? '');
  const sourceLanguage = useAppSelector((state) => state.upload.sourceLanguage ?? '');
  const targetLanguage = useAppSelector((state) => state.upload.targetLanguage ?? '');
  const availableLanguages = useAppSelector((state) => state.upload.availableLanguages ?? []);
  const selectedModel = useAppSelector((state) => state.modelConfig.selectedModel);
  const availableModels = useAppSelector((state) => state.modelConfig.availableModels ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: models = [] } = useGetModelsQuery();
  const { data: languages = [] } = useGetLanguagesQuery();
  const [startTranslation] = useStartTranslationMutation();

  useEffect(() => {
    const nextModels = models.length
      ? models.map((model) => ({
          id: model.id,
          name: model.name,
          description: model.description ?? 'Available translation model',
          speedLabel: model.speedLabel ?? 'Balanced',
          qualityLabel: model.qualityLabel ?? 'Good',
          costLabel: model.costLabel ?? 'Medium',
          maxTokens: model.maxTokens ?? 4000,
          isAvailable: model.isAvailable ?? true,
        }))
      : FALLBACK_MODEL_OPTIONS.map((model) => ({
          id: model.id,
          name: model.name,
          description: 'Fallback translation model',
          speedLabel: 'Balanced',
          qualityLabel: 'Good',
          costLabel: 'Medium',
          maxTokens: 4000,
          isAvailable: true,
        }));

    const hasSameModels = availableModels.length === nextModels.length
      && availableModels.every((model, index) => {
        const candidate = nextModels[index];
        return candidate && model.id === candidate.id && model.name === candidate.name;
      });

    if (!hasSameModels) {
      dispatch(setAvailableModels(nextModels));
    }

    if (!selectedModel && nextModels.length) {
      dispatch(setSelectedModel(nextModels[0]));
    }
  }, [dispatch, models, selectedModel, availableModels]);

  useEffect(() => {
    const nextLanguages = languages.length
      ? languages
          .map((lang) => ({
            value: lang.code ?? lang.id ?? '',
            label: lang.name ?? lang.nativeName ?? lang.code ?? '',
          }))
          .filter((lang) => Boolean(lang.value && lang.label))
      : FALLBACK_LANGUAGE_OPTIONS;

    const hasSameLanguages = availableLanguages.length === nextLanguages.length
      && availableLanguages.every((language, index) => {
        const candidate = nextLanguages[index];
        return candidate && language.value === candidate.value && language.label === candidate.label;
      });

    if (!hasSameLanguages) {
      dispatch(setAvailableLanguages(nextLanguages));
    }
  }, [dispatch, languages, availableLanguages]);

  const columnOptions = useMemo(
    () => columns.map((column) => ({ value: column.name, label: column.name })),
    [columns],
  );

  const modelOptions = useMemo(
    () => availableModels.map((model) => ({ value: model.id, label: model.name })),
    [availableModels],
  );

  const languageOptions = useMemo(
    () => availableLanguages.length ? availableLanguages : FALLBACK_LANGUAGE_OPTIONS,
    [availableLanguages],
  );

  const handleSubmit = async () => {
    const modelToUse = selectedModel ?? availableModels[0];

    if (!uploadedFile) {
      dispatch(toast.error({ message: 'Please upload a CSV file before initializing translation.' }));
      return;
    }

    if (!selectedTextColumn || !sourceLanguage || !targetLanguage || !modelToUse) {
      dispatch(toast.error({ message: 'Please upload a CSV file and complete all configuration fields.' }));
      return;
    }

    setIsSubmitting(true);
    dispatch(setTranslateError(null));
    dispatch(setJobStatus(ETranslationStatus.Pending));

    try {
      const job = await startTranslation({
        csvBase64: '',
        fileId: uploadedFile.fileId ?? '',
        fileName: uploadedFile.name,
        textColumn: selectedTextColumn,
        sourceLanguage,
        targetLanguage,
        modelId: modelToUse.id,
      }).unwrap();

      const normalizedJob = {
        ...job,
        id: job.id || `${Date.now()}`,
        fileName: job.fileName || uploadedFile.name,
        textColumn: job.textColumn || selectedTextColumn,
        sourceLanguage: job.sourceLanguage || sourceLanguage,
        targetLanguage: job.targetLanguage || targetLanguage,
        modelId: job.modelId || modelToUse.id,
        status: job.status || ETranslationStatus.Pending,
        createdAt: job.createdAt || new Date().toISOString(),
      };

      dispatch(setCurrentJob(normalizedJob));
      dispatch(setProgress({ progress: 0, translatedRows: 0, totalRows: normalizedJob.totalRows || 0 }));
      dispatch(setJobStatus(normalizedJob.status as ETranslationStatus));
      saveSession(normalizedJob);
      dispatch(toast.success({ message: `Translation job started. ID: ${normalizedJob.id}` }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start translation.';
      dispatch(setTranslateError(message));
      dispatch(setJobStatus(ETranslationStatus.Failed));
      dispatch(toast.error({ message }));
    } finally {
      setIsSubmitting(false);
    }
  };

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
          value={sourceLanguage}
          onChange={(event) => dispatch(setSourceLanguage(event.target.value))}
        />
        <Select
          label="Target Language"
          options={languageOptions}
          value={targetLanguage}
          onChange={(event) => dispatch(setTargetLanguage(event.target.value))}
        />
        <Select
          label="Column for Translation"
          options={columnOptions}
          value={selectedTextColumn}
          onChange={(event) => dispatch(setSelectedTextColumn(event.target.value))}
        />
        <Select
          label="Translation Model"
          options={modelOptions}
          value={selectedModel?.id ?? ''}
          onChange={(event) => {
            const model = availableModels.find((item) => item.id === event.target.value);
            if (model) dispatch(setSelectedModel(model));
          }}
        />
      </div>

      <Button
        variant="primary"
        fullWidth
        size="lg"
        loading={isSubmitting}
        leadingIcon={<Wand2 size={18} />}
        className="mt-8 shadow-lg shadow-primary-500/20 font-bold tracking-wide"
        onClick={handleSubmit}
        disabled={!uploadedFile || isSubmitting}
      >
        Initialize Translation Engine
      </Button>
    </div>
  );
}
