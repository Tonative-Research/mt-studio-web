# Components

All reusable UI primitives live in `src/components/common/` and are exported from the barrel file.

```ts
import { Button, TextInput, Select, Badge, Skeleton, Spinner } from '@/components/common';
```

Never import directly from individual component files — always use the barrel.

---

## Button

Five variants, three sizes, loading spinner, leading/trailing icons, full-width mode.

```tsx
<Button variant="primary" size="md" loading={isSubmitting}>Save</Button>
<Button variant="accent" leadingIcon={<Download size={16} />}>Export</Button>
<Button variant="ghost" size="sm" trailingIcon={<ArrowRight size={14} />}>Next</Button>
<Button variant="danger">Delete</Button>
<Button variant="secondary" fullWidth>Cancel</Button>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary \| secondary \| accent \| ghost \| danger` | `primary` | |
| `size` | `sm \| md \| lg` | `md` | Heights: 32 / 40 / 48 px |
| `loading` | `boolean` | `false` | Swaps leading icon for spinner, sets `aria-busy`, disables the button |
| `leadingIcon` | `ReactNode` | — | Hidden while `loading` is true |
| `trailingIcon` | `ReactNode` | — | Always visible |
| `fullWidth` | `boolean` | `false` | `w-full` |

All other `<button>` HTML attributes are passed through.

---

## Spinner

Used automatically inside `Button`. Also usable standalone for loading states.

```tsx
<Spinner size="md" className="text-primary-500" />
<Spinner size="sm" className="text-white" label="Uploading file…" />
```

| Prop | Type | Default |
|---|---|---|
| `size` | `xs \| sm \| md \| lg` | `md` |
| `className` | `string` | — |
| `label` | `string` | `'Loading…'` (screen reader only) |

---

## Badge

```tsx
<Badge variant="success" dot>Completed</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="warning" size="sm">Processing</Badge>
<Badge variant="info">Queued</Badge>
<Badge variant="neutral">Draft</Badge>
```

| Prop | Type | Default |
|---|---|---|
| `variant` | `info \| success \| warning \| error \| neutral` | `neutral` |
| `size` | `sm \| md` | `md` |
| `dot` | `boolean` | `false` — coloured dot before the label |

---

## Skeleton

Use while async data is loading to prevent layout shift.

```tsx
<Skeleton variant="line" />                              // single line
<Skeleton variant="line" lines={4} />                   // paragraph (last line narrower)
<Skeleton variant="card" />                             // card-shaped block
<Skeleton variant="button" />                           // button-shaped block
<Skeleton variant="circle" width="w-10" height="h-10" /> // avatar circle
```

| Prop | Type | Default |
|---|---|---|
| `variant` | `line \| circle \| card \| button` | `line` |
| `width` | `string` (Tailwind class) | `w-full` |
| `height` | `string` (Tailwind class) | `h-4` |
| `lines` | `number` | `1` |

---

## Form fields

All form field components (`TextInput`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`) share these props:

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Renders a `<label>` with `htmlFor` wired to the input |
| `required` | `boolean` | Appends a red asterisk to the label |
| `error` | `FieldError \| string` | Accepts a React Hook Form `FieldError` or plain string — renders an inline error with an icon |
| `hint` | `string` | Shown below the field when there is no error |

They are all `forwardRef` components, so they work directly with `{...register('fieldName')}` from React Hook Form.

### TextInput

```tsx
<TextInput label="Email" required placeholder="you@example.com" />
<TextInput label="Search" leadingAddon={<Search size={15} />} />
<TextInput
  label="Password"
  type="password"
  trailingAddon={<EyeIcon />}   // pointer-events-auto to be interactive
/>
<TextInput label="Username" error={errors.username} hint="3–20 characters" />
```

Extra props: `leadingAddon`, `trailingAddon` (any `ReactNode`), `containerClassName`.

### Textarea

```tsx
<Textarea label="Description" rows={4} />
<Textarea label="Notes" maxLength={500} showCount hint="Optional" />
<Textarea label="Bio" error={errors.bio} />
```

Extra props: `showCount` (requires `maxLength`), `containerClassName`.

### Select

```tsx
<Select
  label="Target language"
  required
  placeholder="Choose a language…"
  options={[
    { value: 'yo-NG', label: 'Yoruba (Nigeria)' },
    { value: 'sw-TZ', label: 'Swahili (East Africa)' },
    { value: 'ha-NG', label: 'Hausa (Nigeria)', disabled: true },
  ]}
  error={errors.language}
/>
```

Extra props: `options: SelectOption[]`, `placeholder` (renders a disabled first option), `containerClassName`.

### Checkbox

```tsx
<Checkbox
  label="I agree to the terms"
  description="By checking this you accept our privacy policy."
  error={errors.terms}
  {...register('terms')}
/>
```

### RadioGroup

```tsx
<RadioGroup
  name="model"
  label="Translation model"
  required
  value={selectedModel}
  onChange={setSelectedModel}
  options={[
    { value: 'flash', label: 'Gemini 1.5 Flash', description: 'Fast · Good quality' },
    { value: 'pro',   label: 'Gemini 1.5 Pro',   description: 'Balanced · Better quality' },
    { value: 'flash2', label: 'Gemini 2.0 Flash', disabled: true },
  ]}
  orientation="vertical"   // or "horizontal"
/>
```

---

## Form validation (React Hook Form + Zod)

Define a Zod schema once — get runtime validation and the TypeScript type in one step.

```ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'At least 8 characters'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput label="Email" required error={errors.email} {...register('email')} />
      <TextInput label="Password" type="password" required error={errors.password} {...register('password')} />
      <Button type="submit" loading={isSubmitting} fullWidth>Sign in</Button>
    </form>
  );
}
```

**Rules:**
- Place schemas in the same file as the form or a co-located `*.schema.ts` file
- Never use native HTML validation attributes (`required`, `minLength`, `pattern`) on RHF-managed inputs — Zod handles all validation
- `error` prop accepts `FieldError` directly — no need to extract `.message`
- Never duplicate schema types — always use `z.infer<typeof schema>`

---

## ErrorBoundary

Catches render errors in its subtree and shows a recovery UI.

Applied in two places by default:
- `AppProvider.tsx` — wraps the entire app
- `App.tsx` — wraps `<Routes>` for route-level recovery

Use it around any high-risk subtree with a custom fallback:

```tsx
<ErrorBoundary fallback={(err, reset) => (
  <div className="card">
    <p className="text-sm text-red-600">{err.message}</p>
    <Button variant="secondary" size="sm" onClick={reset}>Try again</Button>
  </div>
)}>
  <SomeFeature />
</ErrorBoundary>
```
