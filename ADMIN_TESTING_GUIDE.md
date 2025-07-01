# Admin Authentication & Color Management Testing Guide

## Quick Start - Admin Access

### Method 1: Development Mode (Recommended)
1. Navigate to: `http://localhost:5175/admin/login`
2. Click "Enable" in the **Development Mode** section
3. Use these credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
4. Click "Sign in"
5. You should be redirected to the admin dashboard

### Method 2: Test Server Connection
1. On the admin login page, click "Test Server Connection"
2. **Expected Result**: You'll likely see a CORS or 502 error
3. **This is normal** - the backend has configuration issues
4. **Recommendation**: Use Development Mode instead for testing

## Admin Features Available

### 1. Content Management (`/admin/content`)
- **Logo Management**: Upload and manage site logo
- **Banner Management**: Create and manage promotional banners
- **Category Management**: Manage product categories
- **Footer Management**: Edit footer content
- **Page Management**: Create custom pages
- **🎨 Theme Colors**: **NEW** - Customize brand colors

### 2. Theme Color Customization
Navigate to: **Admin → Content Management → Theme Colors**

#### Features:
- **Real-time Preview**: See changes instantly
- **Color Picker**: Visual color selection
- **Hex Input**: Direct hex code entry
- **Live Preview Toggle**: Enable/disable real-time preview
- **Save & Persist**: Colors persist across browser sessions
- **Reset to Default**: Restore original theme

#### Available Colors:
- **Brand Primary**: Main brand color (buttons, links)
- **Brand Secondary**: Secondary brand color
- **Success**: Success messages and indicators
- **Error**: Error messages and alerts
- **Warning**: Warning messages
- **Accent/Info**: Additional accent color

## Step-by-Step Testing

### Phase 1: Admin Login Test
```bash
# 1. Ensure dev server is running
cd "d:\Pull from Github\Ecommerce_FL_React"
npm run dev

# 2. Open browser to:
http://localhost:5175/admin/login

# 3. Enable Development Mode and login
```

### Phase 2: Color Management Test
```bash
# 1. After successful admin login, navigate to:
http://localhost:5175/admin/content

# 2. Click "Theme Colors" tab

# 3. Test the following:
# - Change Brand Primary color
# - Toggle Preview mode
# - Save changes
# - Refresh page to test persistence
# - Reset to default
```

### Phase 3: Integration Test
```bash
# 1. Change brand colors via admin panel
# 2. Navigate to main site (/) while logged in as admin
# 3. Verify colors are applied site-wide
# 4. Test theme toggle (light/dark) with custom colors
```

## Technical Implementation Details

### Authentication System
- **Frontend Store**: `src/store/Admin/useAdminAuth.js`
- **Login Component**: `src/pages/Admin/AdminLogin.jsx`
- **Route Protection**: Routes check `isAdminAuthenticated` status
- **Token Storage**: JWT tokens stored in localStorage as `admin_token`

### Color Management System
- **Color Manager**: `src/components/Admin/Content/ColorManager.jsx`
- **Utilities**: `src/utils/colorUtils.js`
- **CSS Variables**: Defined in `src/index.css`
- **Persistence**: Colors saved to localStorage as `customColors`
- **Auto-load**: Colors loaded on app initialization

### API Endpoints (Production)
- **Login**: `POST http://69.62.72.199/api/api/admin/login`
- **Register**: `POST http://69.62.72.199/api/api/admin/signup`
- **Health**: `GET http://69.62.72.199/api/api/admin/health`

## Troubleshooting

### Issue: Cannot Access Admin Login
**Solution**: Check if dev server is running on correct port
```bash
# Check server status
npm run dev
# Look for: "Local: http://localhost:XXXX/"
```

### Issue: FiPalette Import Error  
**Error**: `The requested module does not provide an export named 'FiPalette'`
**Solution**: Clear browser cache and restart dev server
```bash
# Stop the server (Ctrl+C), then:
npm run dev
# Or clear browser cache: Ctrl+Shift+R (hard refresh)
```

### Issue: 502 Server Error / CORS Error
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`
**Solution**: Backend server has CORS issues - use Development Mode instead
1. Enable "Development Mode" on login page
2. Use `admin` / `admin123` credentials
3. **This is the recommended approach for testing**

**Technical Details:**
- The production server (`http://69.62.72.199/api/api`) has CORS restrictions
- The server returns 502 Bad Gateway errors
- Development mode bypasses these issues completely

### Issue: Colors Not Saving
**Check**: Browser localStorage permissions
```javascript
// Open browser console and check:
localStorage.getItem('customColors')
```

### Issue: Colors Not Applied
**Solution**: Check CSS variables in browser DevTools
```css
/* Check if these variables exist: */
--brand-primary
--brand-secondary
--success-color
--error-color
--warning-color
--accent-color
```

## Advanced Testing

### Test Production Backend (if available)
```bash
# Test API connectivity
curl -X GET "http://69.62.72.199/api/api/admin/health"

# Test login endpoint
curl -X POST "http://69.62.72.199/api/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### Test Color Persistence
```javascript
// In browser console:
// 1. Save custom colors via admin panel
// 2. Check localStorage:
JSON.parse(localStorage.getItem('customColors'))

// 3. Clear localStorage and refresh:
localStorage.removeItem('customColors')
location.reload()
```

## Expected Results

### ✅ Successful Admin Login
- Redirects to `/admin/dashboard`
- Admin sidebar navigation visible
- All admin routes accessible

### ✅ Color Management Working
- Color picker changes preview in real-time
- Save button persists colors across sessions
- Colors apply site-wide immediately
- Reset button restores defaults

### ✅ Integration Success
- Custom colors work with light/dark theme toggle
- Colors persist after browser refresh
- Admin can access color settings anytime
- No conflicts with existing theming system

## Next Steps After Testing

1. **Backend Integration**: Implement API endpoints for color saving
2. **Role-based Access**: Add permissions for color management
3. **Color Presets**: Add predefined color schemes
4. **Advanced Theming**: Extend to typography, spacing, etc.
5. **Preview Mode**: Add site preview with different color schemes

## Security Notes
- Development mode bypasses production authentication
- Admin tokens are stored in localStorage
- Color settings are client-side persisted
- Production requires proper backend authentication
