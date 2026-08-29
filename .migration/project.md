# project

2026-08-29, golden pair via CLI (`shadcn init --preset rhea --base base --force --reinstall`), whole-project migration done as part of the dashboard redesign. 0 wrappers remain on Radix.

## Dependency swap

- Added `@base-ui/react`, `@phosphor-icons/react`, `tw-animate-css`, `input-otp`, `@tanstack/react-table@8`.
- Removed `@radix-ui/react-avatar`, `-dialog`, `-dropdown-menu`, `-icons`, `-label`, `-popover`, `-select`, `-slot`, `-toast`, `lucide-react`, `react-icons`, `tailwindcss-animate`, `sonner`, `vaul`, and the unused `@clerk/nextjs`.
- `components.json`: style `new-york` -> `base-rhea`, iconLibrary `radix` -> `phosphor`, baseColor `zinc` -> `neutral`.

## Wrappers

All 16 previously installed wrappers were pristine (legacy `new-york`), so they were replaced by the `base-rhea` variants instead of merged. `form.tsx` (react-hook-form + Radix Label/Slot) was deleted; forms now use `field.tsx` with `Controller` directly. `sonner.tsx` was deleted in favor of the Base UI `toast.tsx`.

New wrappers: alert-dialog, bubble, empty, field, input-group, input-otp, kbd, message, message-scroller, scroll-area, separator, skeleton, spinner, textarea, toast, toggle, toggle-group, tooltip.

## App code sweep

Every consumer was rewritten rather than patched (the dashboard was redesigned at the same time), so the `asChild` -> `render` sweep is complete by construction. Call sites that rely on Base UI-specific behavior:

- `Select` requires `items`; `onValueChange` receives `string | null`, guarded in `application-form.tsx`.
- `DropdownMenuRadioItem` gets `closeOnClick` in `status-menu.tsx` so picking a status closes the menu (Base UI default is to stay open).
- `DropdownMenuCheckboxItem` in the status filter intentionally keeps the menu open (Base UI default), which is the behavior we want for multi-select.
- `Button` rendered as `<a>` / `Link` passes `nativeButton={false}`.

## Flagged behavior deltas

- Menus: item click no longer closes checkbox/radio items unless `closeOnClick` is set (handled where it matters, see above).
- `Sheet` on Base UI animates with `data-starting-style` / `data-ending-style`; the old chat drawer was removed anyway.
- Intentionally untouched third-party wrappers: calendar (react-day-picker, bumped to v10 by the CLI), input-otp, chart (not installed).

## Verification

`pnpm check` (oxlint, oxfmt --check, `next typegen && tsc --noEmit`) passes. No browser run in this session; see the summary in the session notes for what still needs a visual pass.
