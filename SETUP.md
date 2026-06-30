# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What Changed

### Migration from Groq to Gemini
- ✅ Migrated from `@ai-sdk/groq` to `@ai-sdk/google`
- ✅ Using `gemini-2.0-flash-exp` model (faster, better JSON generation)
- ✅ Removed Groq-specific JSON mode options (Gemini handles structured outputs natively)

### Improved Loading Experience
- ✅ **Instant redirect**: Clicking "Generate" now immediately navigates to the quiz page
- ✅ **Skeleton loading**: Beautiful animated placeholders while quiz generates
- ✅ **Polling mechanism**: Quiz room checks for quiz data every 200ms
- ✅ **Error handling**: Failed generation shows proper error message with retry option
- ✅ **30s timeout**: Prevents infinite loading if generation stalls

The old loading state with progress bars has been removed. Users now see the quiz page immediately with skeleton loaders instead of waiting on the home page.
