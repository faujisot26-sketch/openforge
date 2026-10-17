# OpenForge

**Understand an open-source issue. Find a safe first step.**

OpenForge helps a new contributor turn a public GitHub issue into a practical, beginner-friendly plan. It reads the issue, a few recent comments, and the repository README, then asks Gemma 4 to explain the task, suggest places to investigate, outline tests, and flag questions worth asking a maintainer.

OpenForge is deliberately careful about uncertainty: suggested file paths are starting points to inspect, not claims that a fix belongs there. It keeps the Gemini API key on the local server and sends only the GitHub material needed for the analysis to Gemma 4.

## Run it

You need Node.js 18 or newer and a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

In a terminal, open this folder and run:

```sh
GEMINI_API_KEY="your-key" npm start
```

Then visit [http://localhost:3000](http://localhost:3000). On Windows PowerShell, set the key first with `$env:GEMINI_API_KEY="your-key"`, then run `npm start`.

No package installation is needed; the server uses Node.js built-ins. The key is read from the server environment and is never sent to the browser or committed to the repository.

## Use OpenForge

1. Paste a public GitHub issue URL, such as `https://github.com/owner/repo/issues/42`.
2. Choose **Build my contribution plan**.
3. Review the plain-language summary, suggested areas to inspect, test ideas, and questions for the maintainer.

The GitHub API and Gemini API both need to be reachable. GitHub's unauthenticated API has rate limits. OpenForge does not create branches, write code, or submit pull requests on your behalf.

## How the AI is used

The local Node.js server fetches the issue, up to six recent comments, and the repository README from GitHub. It sends those excerpts to the Gemma 4 `gemma-4-26b-a4b-it` model through Google's Gemini API. The model returns a structured contribution plan. The app labels candidate files as hypotheses and asks contributors to verify them in the codebase.

## Stack

- HTML, CSS, and browser JavaScript
- Node.js built-in HTTP server and `fetch`
- GitHub REST API
- Gemma 4 through the Gemini API

## Privacy and limits

- The Gemini API key is only read by the local server process.
- Issue text, selected comments, and README excerpts are sent to Google's Gemini API for analysis.
- Only public GitHub issue URLs are supported.
- AI output can be wrong. Confirm all suggestions against the repository and its contribution guide.

## License

MIT. See [LICENSE](LICENSE).
