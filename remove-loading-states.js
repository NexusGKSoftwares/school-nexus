const fs = require('fs');
const path = require('path');

// Function to remove loading states from a file
function removeLoadingStates(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove loading state variable declaration
    content = content.replace(/const \[loading, setLoading\] = useState\(true\);/g, 'const [loading, setLoading] = useState(false);');
    
    // Remove loading state checks
    content = content.replace(/if \(loading\) \{[^}]*\}/gs, '');
    
    // Remove setLoading(true) calls
    content = content.replace(/setLoading\(true\);/g, '');
    
    // Remove setLoading(false) calls
    content = content.replace(/setLoading\(false\);/g, '');
    
    // Remove loading imports
    content = content.replace(/,\s*Loader2/g, '');
    content = content.replace(/Loader2,\s*/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Removed loading states from: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Dashboard files to process
const dashboardFiles = [
  'src/pages/admin/Dashboard.tsx',
  'src/pages/student/Dashboard.tsx',
  'src/pages/lecturer/Dashboard.tsx'
];

console.log('🚀 Removing loading states from dashboards...');

dashboardFiles.forEach(file => {
  if (fs.existsSync(file)) {
    removeLoadingStates(file);
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log('✅ Done! Loading states removed from dashboards.'); 