# Dev Tools

## Component Showcase

A dedicated interactive page to visually inspect and test every common component — no Storybook needed.

### Opening it

```bash
npm run dev
```

Then navigate to:

```
http://localhost:3000/dev/components
```

This route only exists when `import.meta.env.DEV` is `true` (i.e. during `npm run dev`). It is never compiled into production builds.

### What it covers

| Section | What to interact with |
|---|---|
| **Button** | All 5 variants, 3 sizes, icons, 2-second loading spinner (click to trigger), disabled states, full-width |
| **Spinner** | 4 sizes, 5 colour options including on a dark background |
| **Badge** | 5 variants, dot indicator, small size |
| **Skeleton** | Single line, paragraph, card, button, circles, composed loading card |
| **Toast** | Fire each variant individually. "Trigger 3 in sequence" fires 800 ms apart. Error toasts persist; others dismiss after 4 s |
| **TextInput** | Default, required, hint + icon, error state, password toggle, disabled, live validation |
| **Textarea** | Default, character counter, error, disabled |
| **Select** | Placeholder, required, error, disabled |
| **Checkbox** | Interactive, with description, error, both disabled states |
| **RadioGroup** | Vertical with descriptions, horizontal with disabled option |
| **ErrorBoundary** | Click "Trigger render crash" — only that section is replaced, the rest of the page stays intact |

### Adding a component to the showcase

The page is at `src/pages/ComponentShowcasePage.tsx`. Add a `<Section>` block with `<Row>` groups:

```tsx
<Section title="MyComponent">
  <Row label="Default">
    <MyComponent />
  </Row>
  <Row label="Error state">
    <MyComponent error="Something went wrong" />
  </Row>
</Section>
```

Every new or changed common component must be reflected here. The showcase is the single source of visual truth for the component library.

---

## Toast notifications

Toast state lives in `src/redux/toastSlice.ts`. Dispatch from any component:

```ts
import { toast } from '@/redux/toastSlice';
import { useAppDispatch } from '@/redux/hooks';

const dispatch = useAppDispatch();

dispatch(toast.success({ message: 'Translation complete!' }));
dispatch(toast.error({ message: 'Something went wrong. Please try again.' }));
dispatch(toast.info({ message: 'Job queued for processing.' }));
dispatch(toast.warning({ message: 'File size is close to the 50 MB limit.' }));
```

| Variant | Auto-dismisses | Duration |
|---|---|---|
| `success` | Yes | 4 s |
| `info` | Yes | 4 s |
| `warning` | Yes | 4 s |
| `error` | No | Until dismissed |

`ToastContainer` is mounted once in `AppProvider`. Do not add it to individual pages.

Custom duration:

```ts
dispatch(toast.success({ message: 'Saved.', duration: 2000 }));
dispatch(toast.error({ message: 'Critical error.', duration: 0 })); // never dismisses
```
