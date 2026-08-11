import { useEffect, useMemo, useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSelectedModel, setAvailableModels } from '@/redux/modelConfigSlice';
import { setSelectedTextColumn, setSourceLanguage, setTargetLanguage, setAvailableLanguages } from '@/redux/uploadSlice';
import { setCurrentJob, setTranslateError } from '@/redux/translateSlice';
import { toast } from '@/redux/toastSlice';
import { useGetModelsQuery } from '@/services/api/model';
import { useGetLanguagesQuery } from '@/services/api/language';
import { useStartTranslationMutation } from '@/services/api/translate';
import { ETranslationStatus } from '@/services/types/translate';

const FALLBACK_LANGUAGE_OPTIONS = [
  { value: 'auto', label: 'Automatic/Detect language' },
  { value: 'eng', label: 'English' },
  { value: 'ibo', label: 'Igbo' },
  { value: 'yor', label: 'Yoruba' },
  { value: 'hau', label: 'Hausa' },
  { value: 'efi', label: 'Efik' },
  { value: 'pcm', label: 'Nigerian Pidgin' },
  { value: 'ewe', label: 'Ewe' },
  { value: 'wol', label: 'Wolof' },
  { value: 'amh', label: 'Amharic' },
  { value: 'swh', label: 'Swahili' },
  { value: 'luo', label: 'Luo' },
  { value: 'xog', label: 'Soga' },
  { value: 'kin', label: 'Kinyarwanda' },
  { value: 'kik', label: 'Kikuyu' },
  { value: 'nya', label: 'Chichewa' },
];

// Only used if GET /services/model/models fails outright. Mirrors the real
// backend models exactly (confirmed via curl 2026-07-11) — do NOT add models
// here that aren't in that list, POST /services/translate/ only accepts
// model_name = 'Gemini_Flash' or 'Gemini_pro'.
const FALLBACK_MODEL_OPTIONS = [
  { id: 'Gemini_Flash', name: 'Gemini Flash' },
  { id: 'Gemini_pro', name: 'Gemini Pro' },
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
  const userEmail = useAppSelector((state) => state.auth.userEmail ?? '');

  const { data: models = [] } = useGetModelsQuery();
  const { data: languages = [], isError, isFetching } = useGetLanguagesQuery();
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

    // Re-validate the persisted selection against the fresh list — redux-persist
    // can keep a stale selectedModel (e.g. a fallback model id from a session
    // where the models API failed) around indefinitely otherwise, since it's
    // never re-checked once set.
    const selectionIsStillValid = selectedModel
      && nextModels.some((model) => model.id === selectedModel.id);
    if (!selectionIsStillValid && nextModels.length) {
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
      : [];

    const knownLanguages = nextLanguages.length ? nextLanguages : FALLBACK_LANGUAGE_OPTIONS;

    const hasSameLanguages = availableLanguages.length === knownLanguages.length
      && availableLanguages.every((language, index) => {
        const candidate = knownLanguages[index];
        return candidate && language.value === candidate.value && language.label === candidate.label;
      });

    if (!hasSameLanguages) {
      dispatch(setAvailableLanguages(knownLanguages));
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

  const sourceLanguageOptions = useMemo(
    () => availableLanguages,
    [availableLanguages],
  );

  const targetLanguageOptions = useMemo(
    () => availableLanguages.filter((lang) => lang.value !== 'auto'),
    [availableLanguages],
  );

  const handleSubmit = async () => {
    const modelToUse = selectedModel ?? availableModels[0];
    const headers = columns.map((column) => column.name);
    const targetColumnIndex = headers.indexOf(selectedTextColumn);

    // model.id is already the exact model_name value the backend expects
    // ('Gemini_Flash' / 'Gemini_pro') — confirmed via GET /services/model/models
    // (2026-07-11). No transform needed; previously this guessed at a value by
    // slugifying the display name, which broke for any model not already in
    // an explicit map (e.g. a stale/fallback selection).
    const rawModelName = modelToUse?.id;

    if (!uploadedFile || !selectedTextColumn || !sourceLanguage || !targetLanguage || !modelToUse || targetColumnIndex < 0) {
      dispatch(toast.error({ message: 'Please upload a CSV file and complete all configuration fields.' }));
      return;
    }

    const activeUploadedFile = uploadedFile;
    setIsSubmitting(true);
    dispatch(setTranslateError(null));

    try {
      // map UI language codes to backend-accepted codes
      const allowedLangs = ['auto','eng','ibo','yor','hau','efi','pcm','ewe','wol','amh','swh','luo','xog','kin','kik','nya'];
      const normalizeLang = (code: string) => {
        if (!code) return 'auto';
        if (allowedLangs.includes(code)) return code;
        // common mappings
        if (code === 'en') return 'eng';
        if (code === 'sw' || code === 'swh') return 'swh';
        if (code === 'ny') return 'nya';
        // fallback to auto if unknown (avoids server validation error)
        return 'auto';
      };

      const mappedSource = normalizeLang(sourceLanguage);
      const mappedTarget = normalizeLang(targetLanguage);
      const mappedModelName = rawModelName;

      const fileIdRaw = activeUploadedFile.fileId ?? '';
      if (!fileIdRaw) {
        throw new Error('Uploaded file is missing fileId. Please re-upload the CSV.');
      }

      const translatePayload = {
        sourceLanguage: mappedSource,
        targetLanguage: mappedTarget,
        inferenceMode: 'fast',
        modelId: mappedModelName,
        fileId: fileIdRaw,
        email: userEmail ?? '',
        targetColumnIndex,
      };

      const job = await startTranslation(translatePayload).unwrap();

      const normalizedJob = {
        ...job,
        id: job.id || `${Date.now()}`,
        fileName: job.fileName || activeUploadedFile.name,
        textColumn: job.textColumn || selectedTextColumn,
        sourceLanguage: job.sourceLanguage || sourceLanguage,
        targetLanguage: job.targetLanguage || targetLanguage,
        modelId: job.modelId || modelToUse.id,
        status: job.status || ETranslationStatus.Pending,
        percent: job.percent ?? 0,
        createdAt: job.createdAt || new Date().toISOString(),
      };

      // setCurrentJob puts the job into both currentJob and activeJobs, and
      // persists it to localStorage — ActiveJobsTracker picks up polling for
      // it automatically as soon as it lands in activeJobs.
      dispatch(setCurrentJob(normalizedJob));
      dispatch(toast.success({ message: `Translation job started. ID: ${normalizedJob.id}` }));
    } catch (error: any) {
      // Try to extract useful error information from RTK Query / fetch errors
      let message = 'Unable to start translation.';
      if (error) {
        if (typeof error === 'string') message = error;
        else if (error?.data) message = error.data?.message || error.data?.error || JSON.stringify(error.data);
        else if (error?.message) message = error.message;
        else message = JSON.stringify(error);
      }
      dispatch(setTranslateError(message));
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
          options={sourceLanguageOptions}
          value={sourceLanguage}
          onChange={(event) => dispatch(setSourceLanguage(event.target.value))}
        />
        <Select
          label="Target Language"
          options={targetLanguageOptions}
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