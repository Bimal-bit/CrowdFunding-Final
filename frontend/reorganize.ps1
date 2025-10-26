# Create frontend directory
New-Item -Path "frontend" -ItemType Directory -Force

# Copy all frontend files
Copy-Item -Path "src" -Destination "frontend/src" -Recurse -Force
Copy-Item -Path "public" -Destination "frontend/public" -Recurse -Force
Copy-Item -Path "package.json" -Destination "frontend/package.json" -Force
Copy-Item -Path "package-lock.json" -Destination "frontend/package-lock.json" -Force
Copy-Item -Path "index.html" -Destination "frontend/index.html" -Force
Copy-Item -Path "vite.config.ts" -Destination "frontend/vite.config.ts" -Force
Copy-Item -Path "tsconfig.json" -Destination "frontend/tsconfig.json" -Force
Copy-Item -Path "tsconfig.app.json" -Destination "frontend/tsconfig.app.json" -Force
Copy-Item -Path "tsconfig.node.json" -Destination "frontend/tsconfig.node.json" -Force
Copy-Item -Path "tailwind.config.js" -Destination "frontend/tailwind.config.js" -Force
Copy-Item -Path "postcss.config.js" -Destination "frontend/postcss.config.js" -Force
Copy-Item -Path "eslint.config.js" -Destination "frontend/eslint.config.js" -Force
Copy-Item -Path ".env.example" -Destination "frontend/.env.example" -Force

# Rename .jsx files to .tsx in frontend
Get-ChildItem -Path "frontend/src" -Filter "*.jsx" -Recurse | ForEach-Object {
    $newName = $_.FullName -replace '\.jsx$', '.tsx'
    Rename-Item -Path $_.FullName -NewName $newName -Force
}

Write-Host "Frontend folder created and JSX files converted to TSX!"
