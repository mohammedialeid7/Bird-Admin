# CLAUDE_frontend.md — Frontend Development Standards & Guidelines

## Always review this file before doing any frontend task and review + Invoke the right skills for each task

This file governs how Claude writes, structures, and reviews frontend code in this project.
Follow every rule here unless explicitly overridden in a specific prompt.

---

## 🖥️ FRONTEND (React / Next.js)

### Stack Defaults
- **UI components**: shadcn/ui
- **Icons**: Lucide Icons
- **Styling**: Tailwind CSS (utility classes only, no inline styles unless necessary)
- **State**: React hooks (`useState`, `useReducer`) for local; Zustand or React Context for shared state.
- **Forms**: React Hook Form + Zod for validation.

### Code Standards
- Use TypeScript. Every component, function, and API call must be typed — no `any`.
- Keep components small and single-responsibility. Split if a component exceeds ~150 lines.
- Use named exports for components, default exports only for pages.
- Assume all frontend code is public, No sensitive logic or secrets in client-side code — ever.
- Avoid `useEffect` for data fetching — prefer server components or React Query / SWR.
- Always handle loading, error, and empty states in UI components.

### Performance
- Lazy load routes and heavy components with `React.lazy` / `next/dynamic`.
- Optimize images using `next/image` or equivalent.
- Avoid unnecessary re-renders: memoize with `useMemo` / `useCallback` where it makes a measurable difference.