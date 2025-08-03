const fs = require('fs');
const path = require('path');

// Files that use motion components but need proper imports
const filesToFix = [
  'src/components/Admin/ReportsPanel.jsx',
  'src/components/ui/ThemeToggle.jsx',
  'src/pages/OTPTestPage.jsx',
  'src/components/Admin/Content/ThemeManager.jsx',
  'src/components/auth/OTPFormComponents.jsx',
  'src/components/auth/OTPSignupComponent.jsx',
  'src/components/HeroBanner.jsx',
  'src/components/Header/NoticesBar.jsx'
];

function fixMotionImports() {
  console.log('🔧 Fixing framer-motion imports...\n');

  filesToFix.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Pattern 1: Commented out motion import with motion usage
      if (content.includes('motion.') && content.includes('// import { motion }')) {
        content = content.replace(
          /\/\/ import { motion } from 'framer-motion';.*$/m,
          '// eslint-disable-next-line no-unused-vars\nimport { motion } from \'framer-motion\'; // Used for JSX motion elements'
        );
        modified = true;
        console.log(`✅ Fixed commented motion import in: ${file}`);
      }

      // Pattern 2: Missing motion import but has motion usage
      if (content.includes('motion.') && !content.includes('import { motion') && !content.includes('from \'framer-motion\'')) {
        // Find the first import line and add motion import after it
        const importMatch = content.match(/^import.*$/m);
        if (importMatch) {
          const importLine = importMatch[0];
          content = content.replace(
            importLine,
            `${importLine}\n// eslint-disable-next-line no-unused-vars\nimport { motion } from 'framer-motion'; // Used for JSX motion elements`
          );
          modified = true;
          console.log(`✅ Added missing motion import to: ${file}`);
        }
      }

      // Pattern 3: Fix existing imports without eslint-disable
      if (content.includes('import { motion') && !content.includes('eslint-disable-next-line no-unused-vars')) {
        content = content.replace(
          /^import { (motion[^}]*) } from 'framer-motion';.*$/m,
          '// eslint-disable-next-line no-unused-vars\nimport { $1 } from \'framer-motion\'; // Used for JSX motion elements'
        );
        modified = true;
        console.log(`✅ Added eslint-disable to motion import in: ${file}`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
      } else {
        console.log(`ℹ️  No changes needed for: ${file}`);
      }

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });

  console.log('\n🎉 Motion import fixes completed!');
}

fixMotionImports();
