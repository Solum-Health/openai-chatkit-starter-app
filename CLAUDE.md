# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overviews

This is a Next.js starter application for OpenAI's ChatKit, which integrates OpenAI-hosted workflows built using Agent Builder. The app is a minimal chat interface that connects to OpenAI workflows via the ChatKit web component.

## Development Commands

### Setup
```bash
npm install
cp .env.example .env.local
```

### Running the app
```bash
npm run dev        # Start development server on http://localhost:3000
npm run build      # Build for production
npm start          # Run production build
npm run lint       # Run ESLint
```

### Environment Variables (Required)
- `OPENAI_API_KEY` - OpenAI API key from the same org & project as Agent Builder
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` - Workflow ID from Agent Builder (starts with `wf_...`)
- `CHATKIT_API_BASE` (optional) - Custom base URL for ChatKit API endpoint

**Important**: Before running `npm run dev`, execute `unset OPENAI_API_KEY` (or `set OPENAI_API_KEY=` on Windows) if you have a different key in your terminal session, as terminal env vars take precedence over `.env.local`.

## Architecture

### Core Components Structure

**ChatKitPanel** (`components/ChatKitPanel.tsx`) - The main chat interface component
- Manages ChatKit web component lifecycle and state
- Handles session creation via `getClientSecret` callback
- Implements client-side tool handlers (`onClientTool`) for custom actions:
  - `switch_theme` - Switches between light/dark themes
  - `record_fact` - Records facts with deduplication via `processedFacts` ref
- Error handling with three error states: script loading, session creation, and integration errors
- Script loading uses custom events (`chatkit-script-loaded`, `chatkit-script-error`)

**Session Management** (`app/api/create-session/route.ts`) - Edge runtime API endpoint
- Creates ChatKit sessions by calling OpenAI's `/v1/chatkit/sessions` endpoint
- Implements user session persistence via HttpOnly cookies (`chatkit_session_id`)
- Generates user IDs using `crypto.randomUUID()` with fallback to random string
- Handles file upload configuration in session requests
- Runs on Edge runtime for global low-latency

**Theme Management** (`hooks/useColorScheme.ts`)
- Uses `useSyncExternalStore` to subscribe to system color scheme changes
- Persists preference to localStorage with fallback to system preference
- Applies theme via document root classes and CSS variables
- Syncs across tabs via storage events

**Configuration** (`lib/config.ts`)
- Single source of truth for:
  - Workflow ID from environment
  - Starter prompts shown on initial screen
  - ChatKit theme configuration (grayscale hue, accent colors, radius)
  - Greeting message and input placeholder

### Data Flow

1. User opens app → `App.tsx` renders `ChatKitPanel`
2. `ChatKitPanel` mounts → waits for ChatKit script to load
3. `useChatKit` hook calls `getClientSecret` → triggers POST to `/api/create-session`
4. Session endpoint creates OpenAI session → returns `client_secret` and sets user cookie
5. ChatKit initializes with secret → ready for user interaction
6. Client tools (theme switching, fact recording) handled in `onClientTool` callback

### TypeScript Configuration

- Path alias: `@/*` maps to project root
- Strict mode enabled
- Target: ES2017 with DOM libraries
- Module resolution: bundler (Next.js specific)

## Development Notes

### Customizing the Chat Interface

- **Starter prompts**: Edit `STARTER_PROMPTS` array in `lib/config.ts`
- **Theme**: Modify `getThemeConfig` function in `lib/config.ts` - use https://chatkit.studio/playground to explore options
- **Greeting/Placeholder**: Update `GREETING` and `PLACEHOLDER_INPUT` constants
- **Event handlers**: Implement `onWidgetAction` and `onResponseEnd` in `App.tsx` for analytics or persistence

### Adding Client-Side Tools

Client tools are workflow actions executed in the browser. Add handlers in `ChatKitPanel.tsx` `onClientTool`:

```typescript
if (invocation.name === "your_tool_name") {
  // Handle tool invocation
  return { success: true };
}
```

### File Uploads

File attachments are enabled by default (`file_upload.enabled: true` in both `ChatKitPanel.tsx:198` and session creation). To disable, set to `false` in both locations.

### Error Handling

Three error states tracked in `ChatKitPanel`:
- `script` - ChatKit web component loading failures
- `session` - Session creation/refresh failures
- `integration` - Runtime integration errors

Errors display via `ErrorOverlay` component with optional retry capability.

### Local Testing with Webflow Replica

For testing the chat widget as it appears in Webflow without deploying:

1. Start the Next.js dev server: `npm run dev`
2. Serve `test-webflow.html` using a local server:
   - Python: `python3 -m http.server 8000`
   - Node.js: `npx http-server -p 8000`
   - VS Code: Use Live Server extension
3. Open `http://localhost:8000/test-webflow.html` in browser
4. Click the chat bubble (💬) to test the widget

The `test-webflow.html` file replicates the Webflow setup with:
- Chat bubble button (bottom-right corner)
- Iframe loading from `http://localhost:3000`
- Sample page content for testing interactions

**Files**:
- `test-webflow.html` - Local test page (iframe points to localhost)
- `webflow.html` - Production Webflow code (iframe points to Vercel)
- `TEST-SETUP.md` - Detailed testing guide

See `TEST-SETUP.md` for complete testing instructions.

### Deployment

1. Run `npm run build` to verify production build
2. Add deployment domain to [Domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist)
3. Deploy with environment variables configured
4. For GPT-5 workflows, verify organization at [org settings](https://platform.openai.com/settings/organization/general)

**Webflow Integration**: Copy the code from `webflow.html` to your Webflow site's Footer Code (Settings → Custom Code → Footer Code). Update the iframe `src` to your production URL.
