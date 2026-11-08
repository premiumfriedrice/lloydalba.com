#!/usr/bin/env bash
# Re-render the resume PDF to the PNG the /resume page shows.
# Usage: scripts/render-resume.sh [path/to/LloydAlba_Resume.pdf]
# Needs python3 with PyMuPDF (pip install pymupdf).
set -euo pipefail
cd "$(dirname "$0")/.."
src="${1:-public/documents/LloydAlba_Resume.pdf}"
[ "$src" != "public/documents/LloydAlba_Resume.pdf" ] && cp "$src" public/documents/LloydAlba_Resume.pdf
python3 - <<'PY'
import fitz
page = fitz.open("public/documents/LloydAlba_Resume.pdf")[0]
pix = page.get_pixmap(dpi=192, alpha=False)
pix.save("public/documents/LloydAlba_Resume.png")
print(f"rendered {pix.width}x{pix.height}; if the size changed, update width/height in src/app/resume/page.tsx")
PY
