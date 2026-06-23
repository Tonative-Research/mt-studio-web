# State Management

MTStudio uses **Redux Toolkit** for global client state and **RTK Query** (bundled with RTK) for all server state — fetching, caching, and mutations.

## When to use what

| Situation                                       | Tool        |
| ----------------------------------------------- | ----------- |
| Data fetched from or sent to the API            | RTK Query   |
| UI state shared across multiple components      | Redux slice |
| Component-only state (open/closed, input value) | `useState`  |

## Redux slices

| Slice         | File                  | Purpose                                                 |
| ------------- | --------------------- | ------------------------------------------------------- |
| `app`         | `appSlice.ts`         | App-wide UI state (sidebar visibility, search)          |
| `auth`        | `authSlice.ts`        | Auth token, decoded JWT claims, user identity           |
| `account`     | `accountSlice.ts`     | Logged-in user profile                                  |
| `translate`   | `translateSlice.ts`   | Active translation job, progress, status — also writes to `localStorage` via `sessionStorage.ts` |
| `upload`      | `uploadSlice.ts`      | Uploaded file, CSV columns, language selections         |
| `modelConfig` | `modelConfigSlice.ts` | Available Gemini models and the selected model          |
| `toast`       | `toastSlice.ts`       | Notification queue — see [dev-tools.md](./dev-tools.md) |

### Adding a new slice

```ts
// src/redux/myFeatureSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const myFeatureSlice = createSlice({
  name: "myFeature",
  initialState: { value: "" },
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = myFeatureSlice.actions;
export default myFeatureSlice.reducer;
```

Then register it in `src/redux/store.ts` inside `combineReducers`. If the slice should **not** be persisted to `localStorage`, add its key to the `blacklist` in `persistConfig`.

### Using Redux in components

Always use the typed hooks from `@/redux/hooks` — never the untyped `useSelector` / `useDispatch` from `react-redux` directly. This is enforced by the pre-commit hook.

```ts
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setValue } from "@/redux/myFeatureSlice";

const value = useAppSelector((state) => state.myFeature.value);
const dispatch = useAppDispatch();
dispatch(setValue("hello"));
```

## API Layer (RTK Query)

All API calls go through a single `baseApi` instance defined in `src/redux/baseApiSlice.ts`. Features inject their endpoints into it — this keeps each service file self-contained without creating multiple Redux middleware entries.

`baseApiSlice.ts` automatically:

- Reads `auth.authToken` from Redux state and attaches it as a `Bearer` header
- Retries failed requests up to 2 times

`countryApi` in `services/api/country.ts` is a separate `createApi` instance used for static local JSON that requires no auth header.

### Adding a new API endpoint

1. Add the URL to `src/services/api/endpoints.ts`
2. Add the TypeScript types to `src/services/types/`
3. Create the service file:

```ts
// src/services/api/myFeature.ts
import { ENDPOINTS } from "@/services/api/endpoints";
import { baseApi } from "@/redux/baseApiSlice";
import { MyType } from "@/services/types/myFeature";

const myApi = baseApi.enhanceEndpoints({ addTagTypes: ["MyTag"] });

export const myFeatureApi = myApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyData: builder.query<MyType, void>({
      query: () => ENDPOINTS.MY_ENDPOINT,
      providesTags: ["MyTag"],
    }),
    updateMyData: builder.mutation<MyType, Partial<MyType>>({
      query: (body) => ({ url: ENDPOINTS.MY_ENDPOINT, method: "PUT", body }),
      invalidatesTags: ["MyTag"],
    }),
  }),
});

export const { useGetMyDataQuery, useUpdateMyDataMutation } = myFeatureApi;
```

**Rule:** Don't dispatch Redux actions from service files. Service files only define RTK Query endpoints. Dispatch only from components or custom hooks.

---

## Session History (localStorage)

Translation sessions are persisted to `localStorage` as a workaround until account authentication and backend history storage are implemented. This allows users to see past jobs when they return to the same browser.

### How it works

- **`setCurrentJob`** in `translateSlice` calls `saveSession(job)` every time a job is created or updated — this upserts a record into `localStorage` under the key `mtstudio_sessions`.
- **`setJobStatus`** calls `updateSessionStatus(sessionId, status)` to keep the stored status in sync as the job progresses.
- **`resetTranslateState`** (triggered by the "New Session" button) clears Redux state and reloads the page — it does **not** clear `localStorage`, so history is preserved across sessions.

### Utility API (`src/utils/sessionStorage.ts`)

```ts
import { getSessions, saveSession, updateSessionStatus } from '@/utils/sessionStorage';

// Read all sessions (newest first)
const sessions: ISessionRecord[] = getSessions();

// Persist a job (called automatically by translateSlice)
saveSession(job: ITranslationJob): void

// Update status on an existing record (called automatically by translateSlice)
updateSessionStatus(sessionId: string, status: string): void
```

### `ISessionRecord` shape

```ts
interface ISessionRecord {
  sessionId: string;       // matches ITranslationJob.id
  fileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;          // ETranslationStatus value
  createdAt: string;       // ISO 8601 string
}
```

### History page

`/dashboard/history` (`src/pages/HistoryPage.tsx`) reads from `getSessions()` and renders the full list. Each row is expandable to show the session ID (needed for status polling once that is wired up), both languages, status badge, and timestamp.

> **Future:** when email collection or auth is added, session records should be migrated to the backend and `localStorage` used only as a cache.
