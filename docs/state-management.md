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
| `translate`   | `translateSlice.ts`   | Active translation job, progress, status                |
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
