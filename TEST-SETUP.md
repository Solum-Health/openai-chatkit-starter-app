# Local Webflow Testing Setup

This guide explains how to test your ChatKit widget locally without deploying to Webflow.

## Overview

The `test-webflow.html` file replicates your Webflow page setup locally. It includes:
- A chat bubble button (bottom-right corner)
- An iframe that loads your ChatKit app from localhost
- Sample page content to test widget interactions

## Quick Start

### 1. Start the Next.js Development Server

```bash
npm run dev
```

This will start your ChatKit app at `http://localhost:3000`

### 2. Serve the Test HTML File

You have several options:

#### Option A: Using Python (Recommended)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000/test-webflow.html` in your browser.

#### Option B: Using Node.js http-server
```bash
# Install globally if you haven't
npm install -g http-server

# Run from project root
http-server -p 8000
```

Then open `http://localhost:8000/test-webflow.html` in your browser.

#### Option C: Using VS Code Live Server Extension
1. Install the "Live Server" extension in VS Code
2. Right-click on `test-webflow.html`
3. Select "Open with Live Server"

#### Option D: Direct File Opening (May have CORS issues)
You can try opening the file directly in your browser:
```
file:///path/to/project/test-webflow.html
```

**Note**: This might cause CORS errors when loading the iframe. If it doesn't work, use one of the server options above.

### 3. Test the Widget

1. Click the chat bubble (💬) in the bottom-right corner
2. The iframe will appear with your ChatKit app
3. Click the bubble again to close it
4. Press `Escape` key to close the widget

## What You Can Test

### ChatKit App Changes
- Modify starter prompts in `lib/config.ts`
- Update theme configuration
- Change greeting messages
- Add custom client tools
- Test file upload functionality

**How**: After making changes to your Next.js app, refresh the test page. The iframe will reload with your changes.

### Widget Integration
- Chat bubble styling and positioning
- Iframe dimensions and positioning
- Open/close animations
- Mobile responsiveness
- Z-index and layering

**How**: Edit the inline styles in `test-webflow.html` to match your Webflow design.

### Page Interactions
- How the widget behaves with scrolling
- Widget position relative to page content
- Overlay behavior
- Mobile layout

**How**: Add more content to `test-webflow.html` or modify existing sections.

## Customizing the Test Page

### Matching Your Webflow Design

Edit `test-webflow.html` to match your actual Webflow page:

1. **Colors**: Update the CSS variables and color values in the `<style>` section
2. **Fonts**: Change the `font-family` declarations
3. **Layout**: Modify the HTML structure to match your sections
4. **Chat Bubble**: Customize the bubble button styles (line 215-220)
5. **Iframe Size**: Adjust width/height in the iframe styles (line 224-226)

### Chat Bubble Position

To change the chat bubble position, edit the inline styles:
```html
<div id="chat-bubble"
     style="position: fixed; bottom: 24px; right: 24px; ...">
```

### Iframe Size and Position

To adjust the chat iframe:
```html
<iframe id="chat-iframe"
        style="... bottom: 100px; right: 24px; width: 400px; height: 600px; ...">
```

## Deployment to Webflow

Once you're happy with your local testing:

1. Deploy your Next.js app to Vercel (or your hosting platform)
2. Update the iframe `src` in your Webflow footer code:
   ```html
   <iframe id="chat-iframe"
           src="https://your-deployment-url.vercel.app/"
           ...>
   ```
3. Paste the updated code in Webflow's Footer Code section (Settings → Custom Code → Footer Code)

## Troubleshooting

### Iframe Not Loading

**Issue**: The iframe shows blank or doesn't load.

**Solutions**:
- Make sure `npm run dev` is running and Next.js is accessible at http://localhost:3000
- Check browser console for errors
- Verify you're serving the HTML file from a local server (not opening directly)

### CORS Errors

**Issue**: Console shows CORS-related errors.

**Solutions**:
- Use a local server to serve `test-webflow.html` (see step 2 above)
- Don't open the HTML file directly with `file://` protocol

### Chat Bubble Not Clickable

**Issue**: Can't click the chat bubble.

**Solutions**:
- Check z-index values - the bubble should have a higher z-index than other elements
- Verify the bubble isn't covered by other elements (use browser DevTools to inspect)

### Iframe Position Issues

**Issue**: The iframe appears in the wrong position.

**Solutions**:
- Check the iframe's inline styles for `position`, `bottom`, `right` values
- Adjust the responsive JavaScript if testing on mobile

### Environment Variables

**Issue**: ChatKit not working with "Missing workflow id" error.

**Solutions**:
- Make sure `.env.local` has the required variables:
  - `OPENAI_API_KEY`
  - `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
- Restart the Next.js dev server after changing env variables

## Advanced Features

### Mobile Testing

The test page includes responsive adjustments. Test on mobile by:
1. Using Chrome DevTools device emulation
2. Opening on your phone (if using a service like ngrok)

### Testing with Your Actual Webflow Content

If you have HTML export from Webflow:
1. Copy sections from your Webflow export
2. Paste them into `test-webflow.html` (replace the sample content)
3. Make sure to preserve the chat widget code at the bottom

### Testing Different Workflows

To test different Agent Builder workflows:
1. Update `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` in `.env.local`
2. Restart the Next.js dev server
3. Refresh the test page

## Tips

- Keep both the Next.js dev server and the HTML file server running simultaneously
- Use browser DevTools to inspect the iframe and debug issues
- Test the escape key behavior and mobile responsiveness
- Try different window sizes to see how the widget adapts
- Check the browser console for helpful debug logs (visible in development mode)

## File Reference

- `test-webflow.html` - Local test page with chat widget
- `webflow.html` - Production code for Webflow (uses Vercel URL)
- `lib/config.ts` - ChatKit configuration (prompts, theme, etc.)
- `components/ChatKitPanel.tsx` - Main chat component
- `.env.local` - Environment variables (not in git)
