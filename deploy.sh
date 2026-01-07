#!/bin/bash
echo "🔨 Building seloclube-web..."
ng build --configuration production

echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deploy complete!"
