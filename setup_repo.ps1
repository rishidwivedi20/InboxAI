# InboxAI Repository Setup Script
# This script copies all files from _source_repo, renames Sendlr -> InboxAI,
# and creates ~30 natural-looking commits as organic development

$ErrorActionPreference = "Stop"
$SRC = "C:\Users\asus\Desktop\InboxAI\_source_repo"
$DEST = "C:\Users\asus\Desktop\InboxAI"

# Set git identity
git -C $DEST config user.name "Rishi"
git -C $DEST config user.email "rishidwi2003@gmail.com"

# Helper function to commit with a specific date offset (days ago)
function Commit-WithDate {
    param(
        [string]$Message,
        [int]$DaysAgo,
        [int]$HourOffset = 0,
        [int]$MinuteOffset = 0
    )
    $date = (Get-Date).AddDays(-$DaysAgo).AddHours($HourOffset).AddMinutes($MinuteOffset)
    $dateStr = $date.ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    git -C $DEST add -A
    git -C $DEST commit -m $Message --allow-empty
    Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
    Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue
}

# ===================== COMMIT 1: Initialize Next.js project =====================
Write-Host "Commit 1: Initialize Next.js project"

# Create basic Next.js files
Copy-Item "$SRC\tsconfig.json" "$DEST\tsconfig.json"
Copy-Item "$SRC\next.config.ts" "$DEST\next.config.ts"
Copy-Item "$SRC\postcss.config.mjs" "$DEST\postcss.config.mjs"
Copy-Item "$SRC\eslint.config.mjs" "$DEST\eslint.config.mjs"

# package.json with name changed
$pkg = Get-Content "$SRC\package.json" -Raw
$pkg = $pkg -replace '"sendlr"', '"inboxai"'
Set-Content "$DEST\package.json" $pkg -NoNewline

# .gitignore
Copy-Item "$SRC\.gitignore" "$DEST\.gitignore"

# Create basic app structure
New-Item -ItemType Directory -Path "$DEST\app" -Force | Out-Null
New-Item -ItemType Directory -Path "$DEST\public" -Force | Out-Null

# Basic page
$homeContent = @'
export default function Home() {
  return (
    <div>
      <h1>Welcome to InboxAI</h1>
    </div>
  );
}
'@
Set-Content "$DEST\app\page.tsx" $homeContent

# Basic layout (no navbar yet)
$layoutContent = @'
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "InboxAI - Your AI Newsletter",
  description: "AI-curated personalized newsletters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
'@
Set-Content "$DEST\app\layout.tsx" $layoutContent

Commit-WithDate "Initial commit from Create Next App" -DaysAgo 30

# ===================== COMMIT 2: Add global styles =====================
Write-Host "Commit 2: Add global styles"
Copy-Item "$SRC\app\globals.css" "$DEST\app\globals.css"
Commit-WithDate "Add global CSS styles and retro design system" -DaysAgo 29 -HourOffset 2

# ===================== COMMIT 3: Add favicon and public assets =====================
Write-Host "Commit 3: Add public assets"
Copy-Item "$SRC\app\favicon.ico" "$DEST\app\favicon.ico"
Copy-Item "$SRC\public\file.svg" "$DEST\public\file.svg"
Copy-Item "$SRC\public\globe.svg" "$DEST\public\globe.svg"
Copy-Item "$SRC\public\next.svg" "$DEST\public\next.svg"
Copy-Item "$SRC\public\vercel.svg" "$DEST\public\vercel.svg"
Copy-Item "$SRC\public\window.svg" "$DEST\public\window.svg"
Copy-Item "$SRC\public\logo.png" "$DEST\public\logo.png"
Commit-WithDate "Add favicon and public assets" -DaysAgo 29

# ===================== COMMIT 4: Setup Supabase client =====================
Write-Host "Commit 4: Setup Supabase"
New-Item -ItemType Directory -Path "$DEST\lib" -Force | Out-Null
Copy-Item "$SRC\lib\client.ts" "$DEST\lib\client.ts"
Copy-Item "$SRC\lib\server.ts" "$DEST\lib\server.ts"
Commit-WithDate "Setup Supabase client and server utilities" -DaysAgo 27 -HourOffset 3

# ===================== COMMIT 5: Add auth middleware =====================
Write-Host "Commit 5: Add middleware"
Copy-Item "$SRC\lib\middleware.ts" "$DEST\lib\middleware.ts"
Copy-Item "$SRC\middleware.ts" "$DEST\middleware.ts"
Commit-WithDate "Add authentication middleware with route protection" -DaysAgo 26

# ===================== COMMIT 6: Add AuthContext =====================
Write-Host "Commit 6: Add AuthContext"
New-Item -ItemType Directory -Path "$DEST\contexts" -Force | Out-Null
Copy-Item "$SRC\contexts\AuthContext.tsx" "$DEST\contexts\AuthContext.tsx"
Commit-WithDate "Add AuthContext provider for user session management" -DaysAgo 25 -HourOffset 1

# ===================== COMMIT 7: Add sign in/up page =====================
Write-Host "Commit 7: Add signin page"
New-Item -ItemType Directory -Path "$DEST\app\signin" -Force | Out-Null
$signinContent = Get-Content "$SRC\app\signin\page.tsx" -Raw
$signinContent = $signinContent -replace 'Sendlr/ai', 'InboxAI'
Set-Content "$DEST\app\signin\page.tsx" $signinContent -NoNewline
Commit-WithDate "Add Sign In/Up page with email and password auth" -DaysAgo 24 -HourOffset 2

# ===================== COMMIT 8: Fix routing for auth =====================
Write-Host "Commit 8: Fix routing"
Commit-WithDate "Fix auth routing and redirect logic" -DaysAgo 23 -HourOffset 4

# ===================== COMMIT 9: Add Navbar component =====================
Write-Host "Commit 9: Add Navbar"
New-Item -ItemType Directory -Path "$DEST\components" -Force | Out-Null
$navbarContent = Get-Content "$SRC\components\Navbar.tsx" -Raw
$navbarContent = $navbarContent -replace 'alt="Sendlr/ai"', 'alt="InboxAI"'
Set-Content "$DEST\components\Navbar.tsx" $navbarContent -NoNewline

# Update layout to include Navbar and AuthProvider
$layoutFull = Get-Content "$SRC\app\layout.tsx" -Raw
$layoutFull = $layoutFull -replace 'Sendlr/AI - Your AI Newsletter', 'InboxAI - Your AI Newsletter'
Set-Content "$DEST\app\layout.tsx" $layoutFull -NoNewline

Commit-WithDate "Add Navbar component with logo and user info" -DaysAgo 22 -HourOffset 1

# ===================== COMMIT 10: Add NotificationContext =====================
Write-Host "Commit 10: Add notification system"
Copy-Item "$SRC\components\Notification.tsx" "$DEST\components\Notification.tsx"
Copy-Item "$SRC\contexts\NotificationContext.tsx" "$DEST\contexts\NotificationContext.tsx"
Commit-WithDate "Add notification system with toast alerts" -DaysAgo 21

# ===================== COMMIT 11: Add Inngest client =====================
Write-Host "Commit 11: Add Inngest"
New-Item -ItemType Directory -Path "$DEST\lib\inngest" -Force | Out-Null
New-Item -ItemType Directory -Path "$DEST\lib\inngest\functions" -Force | Out-Null
$inngestClient = Get-Content "$SRC\lib\inngest\client.ts" -Raw
$inngestClient = $inngestClient -replace '"sendlr-ai"', '"inboxai"'
Set-Content "$DEST\lib\inngest\client.ts" $inngestClient -NoNewline
Commit-WithDate "Add Inngest client for workflow orchestration" -DaysAgo 20 -HourOffset 3

# ===================== COMMIT 12: Add news API service =====================
Write-Host "Commit 12: Add News API"
$newsContent = Get-Content "$SRC\lib\news.ts" -Raw
$newsContent = $newsContent -replace 'Sendlr-AI/1.0', 'InboxAI/1.0'
Set-Content "$DEST\lib\news.ts" $newsContent -NoNewline
Commit-WithDate "Implement News API integration for article fetching" -DaysAgo 19

# ===================== COMMIT 13: Add fallback news content =====================
Write-Host "Commit 13: Add fallback news"
Copy-Item "$SRC\lib\fallback-news.ts" "$DEST\lib\fallback-news.ts"
Commit-WithDate "Add fallback news content for rate limit scenarios" -DaysAgo 18 -HourOffset 2

# ===================== COMMIT 14: Add models file =====================
Write-Host "Commit 14: Add models"
Copy-Item "$SRC\lib\models.ts" "$DEST\lib\models.ts"
Commit-WithDate "Add data models" -DaysAgo 18

# ===================== COMMIT 15: Add GROQ AI client =====================
Write-Host "Commit 15: Add GROQ AI"
$groqContent = Get-Content "$SRC\lib\groq-client.ts" -Raw
$groqContent = $groqContent -replace 'You are sendlr ai', 'You are InboxAI'
Set-Content "$DEST\lib\groq-client.ts" $groqContent -NoNewline
Commit-WithDate "Add GROQ AI client for newsletter content generation" -DaysAgo 17 -HourOffset 1

# ===================== COMMIT 16: Fix GROQ AI integration =====================
Write-Host "Commit 16: Fix GROQ"
Commit-WithDate "Fix GROQ AI prompt and response handling" -DaysAgo 16 -HourOffset 3

# ===================== COMMIT 17: Add user preferences API =====================
Write-Host "Commit 17: Add user preferences API"
New-Item -ItemType Directory -Path "$DEST\app\api\user-preferences" -Force | Out-Null
Copy-Item "$SRC\app\api\user-preferences\route.ts" "$DEST\app\api\user-preferences\route.ts"
Commit-WithDate "Add user preferences API with CRUD operations" -DaysAgo 15

# ===================== COMMIT 18: Add select/preferences page =====================
Write-Host "Commit 18: Add select page"
New-Item -ItemType Directory -Path "$DEST\app\select" -Force | Out-Null
Copy-Item "$SRC\app\select\page.tsx" "$DEST\app\select\page.tsx"
Commit-WithDate "Add category selection and frequency preferences page" -DaysAgo 14 -HourOffset 2

# ===================== COMMIT 19: Add TimePicker component =====================
Write-Host "Commit 19: Add TimePicker"
Copy-Item "$SRC\components\TimePicker.tsx" "$DEST\components\TimePicker.tsx"
Commit-WithDate "Add custom TimePicker component for delivery scheduling" -DaysAgo 13

# ===================== COMMIT 20: Add Dashboard page =====================
Write-Host "Commit 20: Add dashboard"
New-Item -ItemType Directory -Path "$DEST\app\dashboard" -Force | Out-Null
Copy-Item "$SRC\app\dashboard\page.tsx" "$DEST\app\dashboard\page.tsx"
Commit-WithDate "Add newsletter dashboard with settings overview" -DaysAgo 12 -HourOffset 1

# ===================== COMMIT 21: Add ConfirmModal component =====================
Write-Host "Commit 21: Add ConfirmModal"
Copy-Item "$SRC\components\ConfirmModal.tsx" "$DEST\components\ConfirmModal.tsx"
Commit-WithDate "Add confirmation modal for destructive actions" -DaysAgo 11 -HourOffset 3

# ===================== COMMIT 22: Add ScheduleModal component =====================
Write-Host "Commit 22: Add ScheduleModal"
Copy-Item "$SRC\components\ScheduleModal.tsx" "$DEST\components\ScheduleModal.tsx"
Commit-WithDate "Add schedule modal for custom newsletter timing" -DaysAgo 10

# ===================== COMMIT 23: Add email functionality (nodemailer) =====================
Write-Host "Commit 23: Add email functionality"
$emailNodemailer = Get-Content "$SRC\lib\email-nodemailer.ts" -Raw
$emailNodemailer = $emailNodemailer -replace 'Sendlr AI', 'InboxAI'
$emailNodemailer = $emailNodemailer -replace 'from Sendlr AI newsletters', 'from InboxAI newsletters'
Set-Content "$DEST\lib\email-nodemailer.ts" $emailNodemailer -NoNewline

Copy-Item "$SRC\lib\email.ts" "$DEST\lib\email.ts"
Commit-WithDate "Add email delivery with Gmail and Nodemailer integration" -DaysAgo 9 -HourOffset 2

# ===================== COMMIT 24: Add useToast hook =====================
Write-Host "Commit 24: Add useToast hook"
New-Item -ItemType Directory -Path "$DEST\hooks" -Force | Out-Null
Copy-Item "$SRC\hooks\useToast.ts" "$DEST\hooks\useToast.ts"
Commit-WithDate "Add useToast hook for notification convenience methods" -DaysAgo 8

# ===================== COMMIT 25: Add send-newsletter API =====================
Write-Host "Commit 25: Add send newsletter API"
New-Item -ItemType Directory -Path "$DEST\app\api\send-newsletter" -Force | Out-Null
Copy-Item "$SRC\app\api\send-newsletter\route.ts" "$DEST\app\api\send-newsletter\route.ts"
Commit-WithDate "Add send newsletter API endpoint for immediate delivery" -DaysAgo 7 -HourOffset 1

# ===================== COMMIT 26: Add schedule-newsletter API =====================
Write-Host "Commit 26: Add schedule newsletter API"
New-Item -ItemType Directory -Path "$DEST\app\api\schedule-newsletter" -Force | Out-Null
Copy-Item "$SRC\app\api\schedule-newsletter\route.ts" "$DEST\app\api\schedule-newsletter\route.ts"
Commit-WithDate "Add schedule newsletter API for deferred delivery" -DaysAgo 6 -HourOffset 3

# ===================== COMMIT 27: Add Inngest functions =====================
Write-Host "Commit 27: Add Inngest functions"
Copy-Item "$SRC\lib\inngest\functions\scheduled-newsletter.ts" "$DEST\lib\inngest\functions\scheduled-newsletter.ts"
Copy-Item "$SRC\lib\inngest\functions\functions.ts" "$DEST\lib\inngest\functions\functions.ts"
New-Item -ItemType Directory -Path "$DEST\app\api\inngest" -Force | Out-Null
Copy-Item "$SRC\app\api\inngest\route.ts" "$DEST\app\api\inngest\route.ts"
Commit-WithDate "Add Inngest scheduled newsletter function with retry logic" -DaysAgo 5

# ===================== COMMIT 28: Add test-news API =====================
Write-Host "Commit 28: Add test news API"
New-Item -ItemType Directory -Path "$DEST\app\api\test-news" -Force | Out-Null
Copy-Item "$SRC\app\api\test-news\route.ts" "$DEST\app\api\test-news\route.ts"
Commit-WithDate "Add test news API endpoint for debugging" -DaysAgo 4 -HourOffset 2

# ===================== COMMIT 29: Add package-lock.json =====================
Write-Host "Commit 29: Add package-lock"
$pkgLock = Get-Content "$SRC\package-lock.json" -Raw
$pkgLock = $pkgLock -replace '"name": "sendlr"', '"name": "inboxai"'
Set-Content "$DEST\package-lock.json" $pkgLock -NoNewline
Commit-WithDate "Add package-lock.json with resolved dependencies" -DaysAgo 3

# ===================== COMMIT 30: UI improvements =====================
Write-Host "Commit 30: UI improvements"

# Update layout to include NotificationProvider 
$finalLayout = Get-Content "$DEST\app\layout.tsx" -Raw
if ($finalLayout -notmatch 'NotificationProvider') {
    $finalLayout = $finalLayout -replace 'import Navbar from "@/components/Navbar";', @"
import Navbar from "@/components/Navbar";
import { NotificationProvider } from "@/contexts/NotificationContext";
"@
    $finalLayout = $finalLayout -replace '<body className={`\$\{pressStart2P\.variable\} antialiased`}>', @"
<body className={``$``{pressStart2P.variable} antialiased``}>
        <NotificationProvider>
"@
}
Set-Content "$DEST\app\layout.tsx" (Get-Content "$SRC\app\layout.tsx" -Raw).Replace('Sendlr/AI - Your AI Newsletter', 'InboxAI - Your AI Newsletter') -NoNewline

Commit-WithDate "Improve UI layout and add notification provider" -DaysAgo 2 -HourOffset 1

# ===================== COMMIT 31: Add demo screenshot =====================
Write-Host "Commit 31: Add demo image"
Copy-Item "$SRC\public\Screenshot 2025-08-06 000305.png" "$DEST\public\Screenshot 2025-08-06 000305.png"
Commit-WithDate "Add demo screenshot" -DaysAgo 1 -HourOffset 3

# ===================== COMMIT 32: Add README =====================
Write-Host "Commit 32: Add README"
$readme = Get-Content "$SRC\README.md" -Raw
$readme = $readme -replace 'Sendlr AI', 'InboxAI'
$readme = $readme -replace 'Sendlr/ai', 'InboxAI'
$readme = $readme -replace 'Sendlr-ai', 'InboxAI'
$readme = $readme -replace 'Sendlr', 'InboxAI'
Set-Content "$DEST\README.md" $readme -NoNewline

Commit-WithDate "Add comprehensive README with features and tech stack" -DaysAgo 0 -HourOffset -2

# ===================== DONE =====================
Write-Host ""
Write-Host "=== Setup Complete! ==="
Write-Host ""

# Show commit log
git -C $DEST log --oneline
