import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from '@/redux/toastSlice';
import {
  Button,
  Spinner,
  Badge,
  Skeleton,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  ErrorBoundary,
} from '@/components/common';
import {
  Download,
  Wand2,
  ArrowRight,
  Mail,
  Eye,
  EyeOff,
  Trash2,
  Plus,
} from 'lucide-react';

// ── Section wrapper ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 pb-2 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ── Error trigger (for testing ErrorBoundary) ──────────────────────────────

function BrokenComponent(): React.ReactElement {
  throw new Error('This component crashed intentionally to test the ErrorBoundary.');
}

function ErrorTrigger() {
  const [explode, setExplode] = useState(false);
  return (
    <ErrorBoundary>
      {explode ? (
        <BrokenComponent />
      ) : (
        <Button variant="danger" size="sm" onClick={() => setExplode(true)}>
          Trigger render crash
        </Button>
      )}
    </ErrorBoundary>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ComponentShowcasePage() {
  const dispatch = useAppDispatch();

  // Button loading demo state
  const [loading, setLoading] = useState(false);
  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  // Password visibility toggle demo
  const [showPassword, setShowPassword] = useState(false);

  // Form field state for interactive demos
  const [inputVal, setInputVal] = useState('');
  const [radioVal, setRadioVal] = useState('flash');
  const [checked, setChecked] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary-900 text-white px-8 py-5 flex items-center justify-between sticky top-0 z-30">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">
            Dev only · not shipped to production
          </p>
          <h1 className="text-lg font-black tracking-tight">Component Showcase</h1>
        </div>
        <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">
          ← Back to app
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* ── Buttons ──────────────────────────────────────────────────── */}
        <Section title="Button">
          <Row label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </Row>

          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>

          <Row label="Icons">
            <Button variant="primary" leadingIcon={<Download size={16} />}>
              Download
            </Button>
            <Button variant="accent" trailingIcon={<ArrowRight size={16} />}>
              Continue
            </Button>
            <Button variant="secondary" leadingIcon={<Plus size={15} />} size="sm">
              Add item
            </Button>
            <Button variant="danger" leadingIcon={<Trash2 size={15} />} size="sm">
              Delete
            </Button>
          </Row>

          <Row label="Loading state (click to trigger 2s)">
            <Button variant="primary" loading={loading} onClick={simulateLoad}>
              {loading ? 'Saving…' : 'Save changes'}
            </Button>
            <Button variant="accent" loading={loading} onClick={simulateLoad}
              trailingIcon={<ArrowRight size={16} />}>
              {loading ? 'Processing…' : 'Start translation'}
            </Button>
          </Row>

          <Row label="Disabled">
            <Button variant="primary" disabled>Primary</Button>
            <Button variant="accent" disabled>Accent</Button>
            <Button variant="secondary" disabled>Secondary</Button>
          </Row>

          <Row label="Full width">
            <div className="w-full max-w-sm">
              <Button variant="primary" fullWidth leadingIcon={<Wand2 size={16} />}>
                Initialize Engine
              </Button>
            </div>
          </Row>
        </Section>

        {/* ── Spinner ──────────────────────────────────────────────────── */}
        <Section title="Spinner">
          <Row label="Sizes">
            <Spinner size="xs" className="text-primary-500" />
            <Spinner size="sm" className="text-primary-500" />
            <Spinner size="md" className="text-primary-500" />
            <Spinner size="lg" className="text-primary-500" />
          </Row>
          <Row label="Colours">
            <Spinner size="md" className="text-primary-500" />
            <Spinner size="md" className="text-accent-500" />
            <Spinner size="md" className="text-gray-400" />
            <Spinner size="md" className="text-red-500" />
            <div className="bg-primary-500 rounded-lg p-2">
              <Spinner size="md" className="text-white" />
            </div>
          </Row>
        </Section>

        {/* ── Badge ────────────────────────────────────────────────────── */}
        <Section title="Badge">
          <Row label="Variants">
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </Row>
          <Row label="With dot indicator">
            <Badge variant="success" dot>Completed</Badge>
            <Badge variant="warning" dot>Processing</Badge>
            <Badge variant="error" dot>Failed</Badge>
            <Badge variant="info" dot>Queued</Badge>
          </Row>
          <Row label="Small size">
            <Badge variant="success" size="sm">Done</Badge>
            <Badge variant="error" size="sm">Error</Badge>
            <Badge variant="neutral" size="sm">Draft</Badge>
          </Row>
        </Section>

        {/* ── Skeleton ─────────────────────────────────────────────────── */}
        <Section title="Skeleton">
          <Row label="Single line">
            <div className="w-full max-w-sm">
              <Skeleton variant="line" />
            </div>
          </Row>

          <Row label="Multiple lines (paragraph)">
            <div className="w-full max-w-sm">
              <Skeleton variant="line" lines={4} />
            </div>
          </Row>

          <Row label="Card">
            <div className="w-full max-w-sm">
              <Skeleton variant="card" />
            </div>
          </Row>

          <Row label="Button">
            <Skeleton variant="button" />
            <Skeleton variant="button" className="w-20" />
          </Row>

          <Row label="Circle (avatar)">
            <Skeleton variant="circle" width="w-10" height="h-10" />
            <Skeleton variant="circle" width="w-12" height="h-12" />
            <Skeleton variant="circle" width="w-16" height="h-16" />
          </Row>

          <Row label="Composed loading card">
            <div className="w-full max-w-sm card flex gap-4">
              <Skeleton variant="circle" width="w-12" height="h-12" className="shrink-0" />
              <div className="flex-1">
                <Skeleton variant="line" height="h-4" width="w-2/3" className="mb-2" />
                <Skeleton variant="line" lines={2} height="h-3" />
              </div>
            </div>
          </Row>
        </Section>

        {/* ── Toast ────────────────────────────────────────────────────── */}
        <Section title="Toast (bottom-right of screen)">
          <Row label="Fire one at a time">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(toast.success({ message: 'Translation complete! CSV is ready to download.' }))}
            >
              Success toast
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(toast.error({ message: 'API call failed. Please check your connection and try again.' }))}
            >
              Error toast (persistent)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(toast.info({ message: 'Job MT-2024-X45 has been queued for processing.' }))}
            >
              Info toast
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(toast.warning({ message: 'File size is approaching the 50 MB limit.' }))}
            >
              Warning toast
            </Button>
          </Row>

          <Row label="Stack multiple">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                dispatch(toast.info({ message: 'Uploading file…' }));
                setTimeout(() => dispatch(toast.success({ message: 'File uploaded successfully.' })), 800);
                setTimeout(() => dispatch(toast.success({ message: 'Translation started.' })), 1400);
              }}
            >
              Trigger 3 in sequence
            </Button>
          </Row>

          <p className="text-xs text-gray-400 mt-2">
            Success / info / warning auto-dismiss after 4s. Error toasts stay until you click ×.
          </p>
        </Section>

        {/* ── TextInput ────────────────────────────────────────────────── */}
        <Section title="TextInput">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <TextInput label="Default" placeholder="Enter text…" />
            <TextInput label="Required field" required placeholder="Required" />
            <TextInput
              label="With hint"
              placeholder="you@example.com"
              hint="We'll never share your email."
              leadingAddon={<Mail size={15} />}
            />
            <TextInput
              label="Error state"
              defaultValue="bad@"
              error="Enter a valid email address"
            />
            <TextInput
              label="Password with toggle"
              type={showPassword ? 'text' : 'password'}
              defaultValue="secretpass"
              trailingAddon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="pointer-events-auto text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
            <TextInput label="Disabled" value="Read-only value" disabled />
            <TextInput
              label="Live validation (type something)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              error={inputVal.length > 0 && inputVal.length < 3 ? 'Minimum 3 characters' : undefined}
              hint={inputVal.length >= 3 ? 'Looks good!' : undefined}
            />
          </div>
        </Section>

        {/* ── Textarea ─────────────────────────────────────────────────── */}
        <Section title="Textarea">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <Textarea label="Default" placeholder="Write something…" />
            <Textarea
              label="With character count"
              placeholder="Max 200 characters…"
              maxLength={200}
              showCount
              hint="Describe your dataset."
            />
            <Textarea
              label="Error state"
              defaultValue="x"
              error="Description must be at least 10 characters"
            />
            <Textarea label="Disabled" value="This field is read-only." disabled />
          </div>
        </Section>

        {/* ── Select ───────────────────────────────────────────────────── */}
        <Section title="Select">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <Select
              label="Target language"
              placeholder="Choose a language…"
              options={[
                { value: 'yo-NG', label: 'Yoruba (Nigeria)' },
                { value: 'sw-TZ', label: 'Swahili (East Africa)' },
                { value: 'ha-NG', label: 'Hausa (Nigeria)' },
                { value: 'ig-NG', label: 'Igbo (Nigeria)' },
              ]}
            />
            <Select
              label="Model (required)"
              required
              defaultValue="gemini-1.5-flash"
              options={[
                { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
                { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
                { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
              ]}
            />
            <Select
              label="Error state"
              error="Please select a target language"
              placeholder="Choose…"
              options={[
                { value: 'yo-NG', label: 'Yoruba' },
                { value: 'sw-TZ', label: 'Swahili' },
              ]}
            />
            <Select
              label="Disabled"
              disabled
              defaultValue="yo-NG"
              options={[{ value: 'yo-NG', label: 'Yoruba (Nigeria)' }]}
            />
          </div>
        </Section>

        {/* ── Checkbox ─────────────────────────────────────────────────── */}
        <Section title="Checkbox">
          <div className="flex flex-col gap-4 max-w-sm">
            <Checkbox
              label="I agree to the terms"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <Checkbox
              label="With description"
              description="Receive email notifications when your translation job completes."
              defaultChecked
            />
            <Checkbox
              label="Error state"
              error="You must accept the terms to continue"
            />
            <Checkbox label="Disabled unchecked" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
          </div>
        </Section>

        {/* ── RadioGroup ───────────────────────────────────────────────── */}
        <Section title="RadioGroup">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-2xl">
            <RadioGroup
              name="model-vertical"
              label="Translation model"
              required
              value={radioVal}
              onChange={setRadioVal}
              options={[
                { value: 'flash', label: 'Gemini 1.5 Flash', description: 'Fast · Good quality · Low cost' },
                { value: 'pro', label: 'Gemini 1.5 Pro', description: 'Balanced · Better quality · Medium cost' },
                { value: 'flash2', label: 'Gemini 2.0 Flash', description: 'Fastest · Best quality · Low cost' },
              ]}
            />
            <RadioGroup
              name="format-horizontal"
              label="Export format"
              orientation="horizontal"
              options={[
                { value: 'csv', label: 'CSV' },
                { value: 'tsv', label: 'TSV' },
                { value: 'json', label: 'JSON', disabled: true },
              ]}
            />
          </div>
        </Section>

        {/* ── ErrorBoundary ────────────────────────────────────────────── */}
        <Section title="ErrorBoundary">
          <p className="text-sm text-gray-500 mb-4">
            Click the button below to throw a render error inside a local{' '}
            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">ErrorBoundary</code>.
            The fallback UI appears in place of the crashed component.
            The rest of the page stays intact.
          </p>
          <ErrorTrigger />
        </Section>

      </div>
    </div>
  );
}
