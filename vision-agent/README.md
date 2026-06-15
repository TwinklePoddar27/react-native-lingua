# Vision Agent Service

This is the AI language teacher service built with Vision Agents.

## Setup

1. Install `uv` if you haven't already.
2. Ensure you have an `OPENAI_API_KEY` in the root `.env` file.
3. Install dependencies:
   ```bash
   uv sync
   ```

## Running Locally

To run the agent in console mode (with a browser UI):
```bash
uv run main.py run
```

## Running as a Server

To run the agent as an HTTP server for production use:
```bash
uv run main.py serve
```
