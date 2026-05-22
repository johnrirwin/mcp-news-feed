# Lessons Learned

Review this file at the start of each session and apply any relevant rules before changing code or documentation.

## How to use this file
- Add a new entry after any correction from the user.
- Capture the context, the correction, and the rule that should prevent the same mistake.
- Prefer specific prevention rules over vague reminders.

## Entry Template

```markdown
### YYYY-MM-DD — Short lesson title
- Context:
- Correction from user:
- Rule to follow next time:
```

## Lessons

### 2026-05-03 — Use subagents for parallel investigation
- Context: workflow guidance and orchestration expectations for non-trivial work.
- Correction from user: make subagent usage explicit when work benefits from research, exploration, or parallel analysis.
- Rule to follow next time: proactively kick off focused subagents for bounded research/exploration tasks instead of keeping all investigation in the main context.

### 2026-05-04 — Use the standard AGENTS filename
- Context: repository-scoped instruction files for generic LLM/agent tooling.
- Correction from user: rename `AGENT.md` to `AGENTS.md` rather than removing generic agent guidance.
- Rule to follow next time: use `AGENTS.md` as the canonical repository instruction filename unless the user explicitly asks for a different convention.

### 2026-05-04 — Remove vendor-specific instruction files, not generic guidance
- Context: repository cleanup for LLM-agnostic tooling.
- Correction from user: remove vendor-specific instruction files while keeping generic repository guidance like `AGENTS.md`.
- Rule to follow next time: when asked to make the repo tool-agnostic, delete vendor-specific instruction files but preserve generic guidance unless the user explicitly asks to remove that too.

### 2026-05-05 — Be explicit about whether code changed
- Context: answering architecture questions mid-implementation.
- Correction from user: make it clear whether I actually changed the code or was only giving guidance.
- Rule to follow next time: explicitly state when no repo changes were made, especially after a design-only or clarification response.

### 2026-05-06 — Keep OAuth consent human-readable and cross-site safe
- Context: self-hosted OAuth consent flow for ChatGPT MCP.
- Correction from user: the consent page exposed raw client metadata and the Approve action did not complete the redirect flow.
- Rule to follow next time: for third-party OAuth consent screens, show the app name plus human-readable requested access only, and treat approval submits as cross-site/browser-embedded flows by using secure cookie settings and POST-safe redirects.

### 2026-05-06 — Verify deployed OAuth/browser flows at the HTTP boundary
- Context: production ChatGPT MCP auth still failed after the consent-flow fix was merged and deployed.
- Correction from user: the same blank-popup behavior persisted in production even after the previous fix shipped.
- Rule to follow next time: when debugging deployed OAuth/browser issues, verify the live HTTP behavior (headers, preflight handling, redirects) against production before assuming the previous hypothesis fully solved the problem.

### 2026-05-06 — Don’t block first-party OAuth form posts with third-party origin rules
- Context: tightening OAuth endpoint CORS/origin checks for ChatGPT compatibility.
- Correction from user: after the stricter origin gate shipped, clicking Approve redirected back to FlyingForge instead of completing OAuth.
- Rule to follow next time: when adding origin restrictions to OAuth endpoints, explicitly allow the app’s own public origin/issuer for first-party browser form submissions in addition to third-party client origins.

### 2026-05-06 — When authorize succeeds but no token exchange follows, inspect popup response mode
- Context: ChatGPT connector OAuth approval kept opening a blank popup even after the consent and CORS fixes were deployed.
- Correction from user: the browser still showed the same spinner-and-blank-popup behavior, so the prior fixes had not resolved the final handoff.
- Rule to follow next time: if production logs show `/oauth/authorize` succeeding but no `/oauth/token` request ever arrives, verify whether the client expects popup-oriented `response_mode=web_message` handling instead of a normal redirect callback.

### 2026-05-06 — Confirm the live request parameters before patching a specific OAuth branch
- Context: I added popup `response_mode` support, but production still showed the same spinner/blank-popup behavior.
- Correction from user: the new patch still did not work in the real ChatGPT flow.
- Rule to follow next time: before committing to a response-mode-specific OAuth fix, inspect the live authorize logs to confirm whether the client is actually sending that parameter and patch the active branch of the flow first.

### 2026-05-07 — Read the browser CSP error literally in OAuth redirect bugs
- Context: the ChatGPT approval flow still failed after redirect-path fixes.
- Correction from user: the browser console showed a precise CSP `form-action` violation for the ChatGPT callback URL.
- Rule to follow next time: when a browser surfaces a CSP violation during OAuth approval, patch the exact blocked directive first—especially `form-action` on consent pages that POST and then redirect to a third-party callback.

### 2026-05-21 — Verify hero-photo visibility, not just style intent
- Context: I shipped a homepage redesign with a background asset, but the overlays and composition made the landscape effectively invisible in the real browser.
- Correction from user: the user pointed out that the homepage did not visibly show the landscape/background image as intended.
- Rule to follow next time: for visual redesigns with hero photography, verify the actual browser result shows the image content clearly before calling the work done; do not treat the presence of an asset reference alone as success.

### 2026-05-21 — Match glassmorphism with actual transparency
- Context: after improving the homepage landscape, the public left rail still felt too opaque and did not let the scenery read through like liquid glass.
- Correction from user: make the side menu transparent and let the landscape show behind it with a liquid-glass style.
- Rule to follow next time: when implementing glassmorphic sidebars over photography, verify the panel translucency is high enough that the background is visibly present, not just blurred behind a dark slab.

### 2026-05-21 — For full-bleed mockups, place the photo at the shell level
- Context: I had made the homepage image more visible, but it was still rendered only inside the content section, so the sidebar could not show the same landscape behind it.
- Correction from user: the landscape hero image should sit behind the side menu like the original reference, not just behind the page content.
- Rule to follow next time: when a reference shows navigation floating over a full-bleed hero, place the background image on the shared shell layer so every transparent surface can reveal the same scene.

### 2026-05-21 — Check brand-wordmark fit in narrow glass rails
- Context: after matching the public-shell mockup more closely, the FlyingForge brand in the sidebar header was clipped because the desktop rail width and wordmark size were too aggressive together.
- Correction from user: the FlyingForge label at the top of the toolbar was being cut off.
- Rule to follow next time: whenever a branded wordmark sits inside a constrained rail or toolbar, verify the rendered text width against the container instead of assuming the chosen font size will fit.

### 2026-05-21 — Shell-level redesigns still need per-component transparency checks
- Context: after moving the app onto the landscape/glass shell, the Public Builds page still had opaque filter and card surfaces that broke the intended effect.
- Correction from user: the filter area and the build card with the drone image should be transparent like the rest of the app, not dark slabs.
- Rule to follow next time: when applying a glassmorphic shell, audit nested page-level toolbars, filters, and feature cards individually to ensure they also use transparent glass surfaces over the shared background.

### 2026-05-21 — Choose hero imagery for text legibility, not just atmosphere
- Context: I replaced the shared scenic shell image with a brighter mountain/lake photo that looked good aesthetically but reduced readability for lighter gray secondary text across public pages.
- Correction from user: revert to the original hero image because the gray supporting copy became hard to see.
- Rule to follow next time: when swapping shell-level photography, verify secondary/body text contrast across representative pages before keeping the new image; do not judge the image on mood alone.

### 2026-05-21 — Raise muted text contrast after shell-wide visual changes
- Context: after rolling out the scenic glass shell across public and authenticated pages, some gray support text remained too dim even with the preferred hero image restored.
- Correction from user: brighten the gray text globally because supporting copy was still hard to read regardless of which hero photo was active.
- Rule to follow next time: after any shell-level background or glassmorphism redesign, audit muted/supporting text contrast across representative pages and raise theme-level text tokens before shipping if readability is borderline.

### 2026-05-21 — Read-only fields must also use glass primitives
- Context: the authenticated profile page looked mostly redesigned, but the read-only email field still rendered as an opaque dark slab because it was a `<div>` with hard-coded slate backgrounds instead of a shared shell style.
- Correction from user: make the profile page field transparent like the rest of the app.
- Rule to follow next time: when restyling forms for the scenic glass shell, audit read-only and non-input field surfaces too; they need their own shared glass primitive instead of relying only on `input` selectors.

### 2026-05-21 — Audit standalone auth transition routes after shell redesigns
- Context: the main login page had been moved onto the scenic glass shell, but the separate `/auth/callback` transition screen still used legacy solid gray backgrounds.
- Correction from user: the post-Google-return screen should be transparent like the rest of the app.
- Rule to follow next time: when redesigning app shells, audit standalone auth callback/loading/error routes too; they are easy to miss because they sit outside the main app router.

### 2026-05-21 — Audit narrow-rail CTA copy fit after simplifying layouts
- Context: after slimming the authenticated sidebar to match the reference, the sign-out CTA still felt cramped because the icon consumed too much space in the narrow footer card.
- Correction from user: remove the logout icon so the button can size correctly.
- Rule to follow next time: when compressing navigation rails or footer cards, verify CTA copy still fits cleanly; on very narrow surfaces prefer text-only actions over icon-plus-label buttons.

### 2026-05-21 — Keep narrow footer identity cards visually minimal
- Context: after simplifying the logged-in sidebar, the profile footer still felt too busy because the name and email competed with the avatar in a very narrow card.
- Correction from user: remove the screen name and email so the footer only shows the photo above the sign-out action.
- Rule to follow next time: when adapting profile/account cards into narrow side rails, default to the avatar-only treatment unless the user explicitly wants identity text preserved.

### 2026-05-21 — After visual fixes, verify the actual rendered route instead of trusting the patch
- Context: I removed the footer identity text from the logged-in sidebar in code, but the user still saw it in the browser afterward.
- Correction from user: the name/email were still present, so I needed to investigate the rendered result instead of assuming the rebuild had taken effect.
- Rule to follow next time: when a user says a UI fix is still visible after a rebuild, inspect the served route/output or browser state before attributing it to caching.

### 2026-05-21 — Explicitly center/crop avatar media in narrow circular shells
- Context: the logged-in sidebar footer was simplified to an avatar-only treatment, but the profile photo still looked a few pixels off-center inside the circular frame.
- Correction from user: the photo needed to be visually centered.
- Rule to follow next time: when placing user-uploaded or arbitrary images into small circular avatars, always set explicit `object-cover` and `object-center` styling instead of relying on default image layout.
