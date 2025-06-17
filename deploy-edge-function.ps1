# Install Supabase CLI if not already installed
if (!(Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Supabase CLI..."
    npm install -g supabase
}

# Deploy the Edge Function
Write-Host "Deploying Edge Function..."
supabase functions deploy sync-outlook-emails --project-ref rbryxtanhrjituiaocno

Write-Host "Deployment complete!" 