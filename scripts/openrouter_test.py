"""Test connectie met OpenRouter API via een simpele chat completion.

Leest OPENROUTER_API_KEY uit .env in de project root. Geen dependencies
nodig buiten de Python standaardbibliotheek.

Gebruik: python3 scripts/openrouter_test.py
"""

import json
import urllib.request
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-4o-mini"


def load_env_key(key: str, env_path: Path) -> str:
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        if name.strip() == key:
            return value.strip().strip('"').strip("'")
    raise RuntimeError(f"{key} niet gevonden in {env_path}")


def main() -> None:
    api_key = load_env_key("OPENROUTER_API_KEY", ENV_PATH)

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": "Zeg in 1 zin dat de OpenRouter verbinding werkt."}
        ],
    }

    request = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        body = json.loads(response.read().decode("utf-8"))

    reply = body["choices"][0]["message"]["content"]
    print(f"Model: {MODEL}")
    print(f"Antwoord: {reply}")


if __name__ == "__main__":
    main()
