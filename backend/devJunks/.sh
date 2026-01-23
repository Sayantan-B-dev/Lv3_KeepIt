// command 1
```

bash <<'EOF'
set -e

rename_if_exists() {
  src="$1"
  dest="$2"
  if [ -f "$src" ] && [ ! -f "$dest" ]; then
    echo "Renaming $src -> $dest"
    mv "$src" "$dest"
  else
    echo "Skipping rename $src"
  fi
}

echo "=== STEP 1: SAFE RENAMES ==="

rename_if_exists controllers/authController.js controllers/auth.controller.js
rename_if_exists controllers/categoryController.js controllers/category.controller.js
rename_if_exists controllers/categoryTypeController.js controllers/categoryType.controller.js
rename_if_exists controllers/globalController.js controllers/global.controller.js
rename_if_exists controllers/noteController.js controllers/note.controller.js
rename_if_exists controllers/profileController.js controllers/profile.controller.js

rename_if_exists models/user.js models/user.model.js
rename_if_exists models/note.js models/note.model.js
rename_if_exists models/category.js models/category.model.js
rename_if_exists models/categoryType.js models/categoryType.model.js

rename_if_exists routes/auth.js routes/auth.routes.js
rename_if_exists routes/category.js routes/category.routes.js
rename_if_exists routes/note.js routes/note.routes.js
rename_if_exists routes/profile.js routes/profile.routes.js
rename_if_exists routes/globalRoutes.js routes/global.routes.js
rename_if_exists routes/categoryTypeRoutes.js routes/categoryType.routes.js

rename_if_exists middlewares/isAuthenticated.js middlewares/isAuthenticated.middleware.js
rename_if_exists middlewares/errorHandler.js middlewares/errorHandler.middleware.js
rename_if_exists middlewares/sanitizeInput.js middlewares/sanitizeInput.middleware.js
rename_if_exists middlewares/validate.js middlewares/validate.middleware.js

echo "=== STEP 2: SAFE IMPORT UPDATES ==="

safe_replace() {
  old="$1"
  new="$2"
  grep -rl "$old" . | xargs sed -i "s|$old|$new|g" || true
}

safe_replace "models/user.js" "models/user.model.js"
safe_replace "models/note.js" "models/note.model.js"
safe_replace "models/category.js" "models/category.model.js"
safe_replace "models/categoryType.js" "models/categoryType.model.js"

safe_replace "controllers/authController.js" "controllers/auth.controller.js"
safe_replace "controllers/categoryController.js" "controllers/category.controller.js"
safe_replace "controllers/categoryTypeController.js" "controllers/categoryType.controller.js"
safe_replace "controllers/globalController.js" "controllers/global.controller.js"
safe_replace "controllers/noteController.js" "controllers/note.controller.js"
safe_replace "controllers/profileController.js" "controllers/profile.controller.js"

safe_replace "routes/auth.js" "routes/auth.routes.js"
safe_replace "routes/category.js" "routes/category.routes.js"
safe_replace "routes/note.js" "routes/note.routes.js"
safe_replace "routes/profile.js" "routes/profile.routes.js"
safe_replace "routes/globalRoutes.js" "routes/global.routes.js"
safe_replace "routes/categoryTypeRoutes.js" "routes/categoryType.routes.js"

safe_replace "middlewares/isAuthenticated.js" "middlewares/isAuthenticated.middleware.js"
safe_replace "middlewares/errorHandler.js" "middlewares/errorHandler.middleware.js"
safe_replace "middlewares/sanitizeInput.js" "middlewares/sanitizeInput.middleware.js"
safe_replace "middlewares/validate.js" "middlewares/validate.middleware.js"

echo "=== REFACTOR COMPLETE (IDEMPOTENT) ==="
EOF


```




//command 2
(
  echo "PROJECT STRUCTURE + IMPORTS / EXPORTS"
  echo "Generated on: $(date)"
  echo "=================================================="
  echo
  echo "FILE TREE"
  echo "--------------------------------------------------"
  find . -type f \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    | sort
  echo
  echo "=================================================="
  echo "IMPORTS / EXPORTS (NORMALIZED)"
  echo "--------------------------------------------------"

  find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    | sort \
    | while read -r file; do
        echo
        echo "FILE: $file"
        echo "----------------------------------------------"

        awk '
          BEGIN {
            in_import = 0
            in_export = 0
            brace_depth = 0
            buf = ""
          }

          # ---------- IMPORTS (keep full, multiline safe) ----------
          /^[[:space:]]*import[[:space:]]/ {
            in_import = 1
          }

          in_import {
            print
            if ($0 ~ /;[[:space:]]*$/) {
              in_import = 0
            }
            next
          }

          # ---------- EXPORT CONST / LET / VAR ----------
          /^[[:space:]]*export[[:space:]]+(const|let|var)[[:space:]]/ {
            in_export = 1
            brace_depth = 0

            # extract "export const name ="
            match($0, /export[[:space:]]+(const|let|var)[[:space:]]+[A-Za-z0-9_]+[[:space:]]*=/)
            printf "%s {...}\n", substr($0, RSTART, RLENGTH)
            next
          }

          # ---------- EXPORT FUNCTION ----------
          /^[[:space:]]*export[[:space:]]+function[[:space:]]/ {
            match($0, /export[[:space:]]+function[^{]+/)
            printf "%s {...}\n", substr($0, RSTART, RLENGTH)
            in_export = 1
            brace_depth = 0
            next
          }

          # ---------- EXPORT DEFAULT FUNCTION ----------
          /^[[:space:]]*export[[:space:]]+default[[:space:]]+function/ {
            match($0, /export[[:space:]]+default[[:space:]]+function[^{]+/)
            printf "%s {...}\n", substr($0, RSTART, RLENGTH)
            in_export = 1
            brace_depth = 0
            next
          }

          # ---------- EXPORT LIST (no body) ----------
          /^[[:space:]]*export[[:space:]]*{.*}/ {
            print
            next
          }

          # ---------- SKIP FUNCTION / OBJECT BODY ----------
          in_export {
            brace_depth += gsub(/{/, "{")
            brace_depth -= gsub(/}/, "}")
            if (brace_depth <= 0 && /}/) {
              in_export = 0
            }
            next
          }
        ' "$file"
      done
) > project_analysis.txt
