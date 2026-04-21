#!/usr/bin/env bash
# Downloads a pinned snapshot of w3c/mathml-polyfills into src/vendor/mathml-polyfills/.
#
# To update to a newer version:
#   1. Find the desired commit SHA at https://github.com/w3c/mathml-polyfills/commits/main
#   2. Update COMMIT below.
#   3. Run this script: bash scripts/update-mathml-polyfills.sh
#   4. Review any changes with `git diff src/vendor/mathml-polyfills/`
#   5. Commit the vendor directory along with the updated COMMIT value in this script.
#
# Current pinned commit: 9b8fea0da9268433b8e32cff82f22a7e305ceec5
# ("role=link and activate on enter keypress for href links", 2026-01-07)

set -euo pipefail

COMMIT="9b8fea0da9268433b8e32cff82f22a7e305ceec5"
BASE_URL="https://raw.githubusercontent.com/w3c/mathml-polyfills/${COMMIT}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/src/vendor/mathml-polyfills"

FILES=(
  "all-polyfills.js"
  "common/math-transforms.js"
  "accent/accent.js"
  "bevelled/bevelled.js"
  "elem-math/elemMath.js"
  "horiz-align/horiz-align.js"
  "href/href.js"
  "linebreaking/linebreaking.js"
  "linethickness/linethickness.js"
  "mathsize/mathsize.js"
  "mathvariant/mathvariant.js"
  "menclose/menclose.js"
  "mfenced/mfenced.js"
  "mglyph/mglyph.js"
  "mlabeledtr/mlabeledtr.js"
  "mpadded/mpadded.js"
  "ms/ms.js"
  "namedspace/namedspace.js"
)

echo "Downloading mathml-polyfills @ ${COMMIT:0:9}..."

for FILE in "${FILES[@]}"; do
  DIR="$DEST/$(dirname "$FILE")"
  mkdir -p "$DIR"
  curl -sSfL "${BASE_URL}/${FILE}" -o "$DEST/$FILE"
  echo "  fetched $FILE"
done

# Remove the CDN cache-buster query string from the local copy of all-polyfills.js
# so Vite's module resolver can find mathvariant/mathvariant.js on disk.
sed -i '' "s|'./mathvariant/mathvariant.js?v=1.0'|'./mathvariant/mathvariant.js'|g" \
  "$DEST/all-polyfills.js"

echo "Done. Vendor files written to src/vendor/mathml-polyfills/"
echo "Commit all changes including src/vendor/mathml-polyfills/ to pin this version."
