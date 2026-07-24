"""Test image generation via OpenRouter (Nano Banana Pro / Gemini 3 Pro Image).

Leest OPENROUTER_API_KEY uit .env in de project root. Geen dependencies
nodig buiten de Python standaardbibliotheek.

Gebruik: python3 scripts/openrouter_image_test.py
"""

import base64
import json
import urllib.request
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
API_URL = "https://openrouter.ai/api/v1/images"
MODEL = "google/gemini-3-pro-image-preview"
OUTPUT_PATH = Path(__file__).resolve().parent / "openrouter_image_test_output.png"


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
        "prompt": (
            "A pink Jeep with panther print seat covers parked on a Curacao "
            "beach at golden hour, vibrant tropical colors, cinematic photo"
        ),
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

    with urllib.request.urlopen(request, timeout=120) as response:
        body = json.loads(response.read().decode("utf-8"))

    image_data = body["data"][0]
    image_bytes = base64.b64decode(image_data["b64_json"])
    OUTPUT_PATH.write_bytes(image_bytes)

    print(f"Model: {MODEL}")
    print(f"Media type: {image_data.get('media_type')}")
    print(f"Afbeelding opgeslagen: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
