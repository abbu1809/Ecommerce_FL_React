#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const files = [
  // Files with unused imports that need to be removed
  {
    file: 'src/components/Admin/ReportsPanel.jsx',
    fixes: [
      {
        from: "import { motion } from 'framer-motion';",
        to: "// import { motion } from 'framer-motion'; // Removed unused import"
      }
    ]
  },
  {
    file: 'src/components/HeroBanner.jsx',
    fixes: [
      {
        from: "import { motion } from 'framer-motion';",
        to: "// import { motion } from 'framer-motion'; // Removed unused import"
      }
    ]
  },
  {
    file: 'src/components/auth/OTPFormComponents.jsx',
    fixes: [
      {
        from: "import { motion } from 'framer-motion';",
        to: "// import { motion } from 'framer-motion'; // Removed unused import"
      }
    ]
  },
  {
    file: 'src/components/auth/OTPSignupComponent.jsx',
    fixes: [
      {
        from: "import { motion } from 'framer-motion';",
        to: "// import { motion } from 'framer-motion'; // Removed unused import"
      }
    ]
  },
  {
    file: 'src/components/ui/ThemeToggle.jsx',
    fixes: [
      {
        from: "import { motion } from 'framer-motion';",
        to: "// import { motion } from 'framer-motion'; // Removed unused import"
      }
    ]
  },
  {
    file: 'src/pages/OTPTestPage.jsx',
    fixes: [
      {
        from: "import { motion } from 'framer-motion';",
        to: "// import { motion } from 'framer-motion'; // Removed unused import"
      }
    ]
  },
  // Files with unused variables that need to be prefixed with underscore
  {
    file: 'src/components/Admin/SellPhone/BrandFormModal.jsx',
    fixes: [
      {
        from: "} catch (error) {",
        to: "} catch (_error) {"
      }
    ]
  },
  {
    file: 'src/components/Admin/SellPhone/ModelFormModal.jsx',
    fixes: [
      {
        from: "const handleAddModel = async (name, brandId) => {",
        to: "const handleAddModel = async (name, _brandId) => {"
      }
    ]
  },
  {
    file: 'src/components/FirebaseOptimizationMonitor.jsx',
    fixes: [
      {
        from: "const optimizedStore = useOptimizedFirestore();",
        to: "const _optimizedStore = useOptimizedFirestore();"
      }
    ]
  },
  {
    file: 'src/components/Footer.jsx',
    fixes: [
      {
        from: "const footerPolicyLinks = [",
        to: "const _footerPolicyLinks = ["
      }
    ]
  },
  {
    file: 'src/components/OrderStatus/OrderStatusList.jsx',
    fixes: [
      {
        from: "const formatDateTime = (dateString) => {",
        to: "const _formatDateTime = (dateString) => {"
      }
    ]
  },
  {
    file: 'src/components/ProductList/EnhancedProductFilter.jsx',
    fixes: [
      {
        from: "const fetchFilterOptions = useCallback(async () => {",
        to: "const _fetchFilterOptions = useCallback(async () => {"
      }
    ]
  },
  {
    file: 'src/components/ProtectedRoute.jsx',
    fixes: [
      {
        from: "const userRole = user?.role || 'customer';",
        to: "const _userRole = user?.role || 'customer';"
      },
      {
        from: "const permissions = user?.permissions || [];",
        to: "const _permissions = user?.permissions || [];"
      }
    ]
  },
  {
    file: 'src/components/ui/ThemeToggle.jsx',
    fixes: [
      {
        from: "}) => (Icon, rest) => {",
        to: "}) => (_Icon, rest) => {"
      }
    ]
  },
  {
    file: 'src/hooks/useFooter.js',
    fixes: [
      {
        from: "import api from '../services/api';",
        to: "// import api from '../services/api'; // Removed unused import"
      }
    ]
  },
  {
    file: 'src/pages/Admin/AdminSellPhone.jsx',
    fixes: [
      {
        from: "const [selectedModel, setSelectedModel] = useState(null);",
        to: "const [_selectedModel, setSelectedModel] = useState(null);"
      },
      {
        from: "const addBrand = brands.addBrand;",
        to: "const _addBrand = brands.addBrand;"
      },
      {
        from: "const updateBrand = brands.updateBrand;",
        to: "const _updateBrand = brands.updateBrand;"
      },
      {
        from: "const addSeries = brands.addSeries;",
        to: "const _addSeries = brands.addSeries;"
      },
      {
        from: "const updateSeries = brands.updateSeries;",
        to: "const _updateSeries = brands.updateSeries;"
      },
      {
        from: "const addModel = brands.addModel;",
        to: "const _addModel = brands.addModel;"
      },
      {
        from: "const updateModel = brands.updateModel;",
        to: "const _updateModel = brands.updateModel;"
      },
      {
        from: "const addFaq = brands.addFaq;",
        to: "const _addFaq = brands.addFaq;"
      },
      {
        from: "const updateFaq = brands.updateFaq;",
        to: "const _updateFaq = brands.updateFaq;"
      }
    ]
  },
  {
    file: 'src/pages/Admin/AdminUsers.jsx',
    fixes: [
      {
        from: "const pagination = users.pagination;",
        to: "const _pagination = users.pagination;"
      },
      {
        from: "const loadMoreUsers = users.loadMore;",
        to: "const _loadMoreUsers = users.loadMore;"
      }
    ]
  },
  {
    file: 'src/pages/FirebaseSetup.jsx',
    fixes: [
      {
        from: "import { testFirebaseConnection, createCategories } from '../services/firebaseService';",
        to: "import { testFirebaseConnection } from '../services/firebaseService';"
      }
    ]
  },
  {
    file: 'src/pages/OurStores.jsx',
    fixes: [
      {
        from: "const [loading, setLoading] = useState(true);",
        to: "const [_loading, setLoading] = useState(true);"
      }
    ]
  },
  {
    file: 'src/pages/SearchResults.jsx',
    fixes: [
      {
        from: "const toggleStorageFilter = (storage) => {",
        to: "const _toggleStorageFilter = (storage) => {"
      },
      {
        from: "const toggleRAMFilter = (ram) => {",
        to: "const _toggleRAMFilter = (ram) => {"
      },
      {
        from: "const toggleColorFilter = (color) => {",
        to: "const _toggleColorFilter = (color) => {"
      },
      {
        from: "const toggleCategoryFilter = (category) => {",
        to: "const _toggleCategoryFilter = (category) => {"
      }
    ]
  },
  {
    file: 'src/store/unifiedAuthStore.js',
    fixes: [
      {
        from: "} catch (error) {",
        to: "} catch (_error) {"
      }
    ]
  },
  {
    file: 'src/store/usePageContentStore.js',
    fixes: [
      {
        from: "import api from '../services/api';",
        to: "// import api from '../services/api'; // Removed unused import"
      }
    ]
  },
  {
    file: 'src/store/useTheme.js',
    fixes: [
      {
        from: "} catch (e) {",
        to: "} catch (_e) {"
      },
      {
        from: "const { setTheme } = useTheme();",
        to: "const { setTheme: _setTheme } = useTheme();"
      }
    ]
  }
];

console.log('🔧 Starting lint fixes...');

files.forEach(({ file, fixes }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  fixes.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(from, to);
      modified = true;
      console.log(`✅ Fixed in ${file}: ${from.substring(0, 50)}...`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`📝 Updated ${file}`);
  }
});

console.log('✨ Lint fixes completed!');
