# 🔧 JSON Error Troubleshooting Guide

## Error: `Unexpected token '"', ""itisaddy"" is not valid JSON`

---

## ✅ Issue Resolved

**Problem:** Corrupted data in browser's localStorage causing JSON parse errors.

**Root Cause:** Invalid JSON string stored in localStorage (likely from manual editing or application bug).

**Solution Applied:**
- ✅ Added error handling in `lib/auth/AuthContext.tsx`
- ✅ Corrupted data is now automatically detected and cleared
- ✅ Application gracefully handles invalid JSON

---

## 🛠️ How to Fix This Issue

### Method 1: Use the Debug Tool (Recommended)

1. Open `tmp_rovodev_clear_storage.html` in your browser
2. Click "View Current Storage" to see what's stored
3. Click "Clear Auth Data Only" to clear authentication data
4. Refresh your application and try again

### Method 2: Browser DevTools

1. Open browser DevTools (Press `F12` or `Ctrl+Shift+I`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** in the left sidebar
4. Select your domain (`http://localhost:3001`)
5. Delete the corrupted keys:
   - `user`
   - `accessToken`
6. Refresh the page

### Method 3: Console Command

1. Open browser console (`F12` > Console tab)
2. Run:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

---

## 🔍 How to Identify JSON Errors

### Common Symptoms:
- White screen or blank page
- Error message: "Unexpected token"
- Error message: "is not valid JSON"
- Application not loading after login
- Console errors mentioning `JSON.parse`

### Where to Check:
1. **Browser Console** (F12 > Console)
   - Look for red error messages
   - Check for parse errors

2. **Network Tab** (F12 > Network)
   - Check API responses
   - Verify response format is valid JSON

3. **Application Tab** (F12 > Application > Local Storage)
   - Check stored data format
   - Verify JSON structure

---

## 🚨 Common Causes of JSON Errors

### 1. Corrupted LocalStorage Data
```javascript
// ❌ Bad - Invalid JSON
localStorage.setItem('user', '"itisaddy"');

// ✅ Good - Valid JSON
localStorage.setItem('user', JSON.stringify({ name: 'itisaddy' }));
```

### 2. Server Returning Non-JSON Response
```javascript
// Check if response is actually JSON
console.log(response.headers['content-type']);
// Should be: "application/json"
```

### 3. Manual Editing of LocalStorage
- Don't manually edit localStorage values
- Always use `JSON.stringify()` to store objects

### 4. API Error Pages as JSON
- Server might return HTML error page instead of JSON
- Always check response headers

---

## ✅ What Was Fixed

### Before (Vulnerable Code):
```typescript
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (token && storedUser) {
    setUser(JSON.parse(storedUser)); // ❌ Can throw error
  }
  setLoading(false);
}, []);
```

### After (Protected Code):
```typescript
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (token && storedUser) {
    try {
      setUser(JSON.parse(storedUser)); // ✅ Wrapped in try-catch
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  }
  setLoading(false);
}, []);
```

---

## 🛡️ Best Practices to Avoid JSON Errors

### 1. Always Use Try-Catch for JSON.parse()
```typescript
// ✅ Good
try {
  const data = JSON.parse(jsonString);
} catch (error) {
  console.error('JSON parse error:', error);
  // Handle error gracefully
}
```

### 2. Validate Data Before Storing
```typescript
// ✅ Good
const saveUser = (user: User) => {
  if (user && typeof user === 'object') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};
```

### 3. Check API Responses
```typescript
// ✅ Good
const response = await axios.get('/api/endpoint');
if (response.headers['content-type']?.includes('application/json')) {
  const data = response.data;
} else {
  console.error('Expected JSON but got:', response.headers['content-type']);
}
```

### 4. Use TypeScript for Type Safety
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
}

// TypeScript will catch type errors at compile time
const user: User = JSON.parse(storedUser);
```

---

## 🧪 Testing for JSON Issues

### Test 1: Validate localStorage Data
```javascript
// Run in browser console
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  try {
    JSON.parse(value);
    console.log(`✅ ${key}: Valid JSON`);
  } catch (error) {
    console.error(`❌ ${key}: Invalid JSON`, error);
  }
}
```

### Test 2: Check API Responses
```javascript
// Run in browser console on your app page
fetch('http://localhost:3000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})
.then(r => r.json())
.then(data => console.log('✅ Valid JSON response:', data))
.catch(err => console.error('❌ Invalid JSON:', err));
```

---

## 📝 Quick Reference

### Commands to Clear Storage

**Clear All:**
```javascript
localStorage.clear();
```

**Clear Auth Only:**
```javascript
localStorage.removeItem('user');
localStorage.removeItem('accessToken');
```

**View Current Storage:**
```javascript
console.log(localStorage);
```

**Test JSON Parse:**
```javascript
try {
  JSON.parse(localStorage.getItem('user'));
  console.log('✅ Valid JSON');
} catch (e) {
  console.error('❌ Invalid JSON:', e);
}
```

---

## 🆘 Still Having Issues?

### Debug Checklist:
- [ ] Cleared browser localStorage
- [ ] Refreshed the application
- [ ] Checked browser console for errors
- [ ] Verified backend is running (`http://localhost:3000`)
- [ ] Verified frontend is running (`http://localhost:3001`)
- [ ] Checked Network tab for API responses
- [ ] Tried logging in with fresh credentials

### If Error Persists:
1. Check backend logs: `backend_logs.txt`
2. Verify database connection
3. Check API endpoint responses in Network tab
4. Try a different browser (to rule out cache issues)
5. Clear all browser data for the site

---

## 📊 Error Prevention Summary

| Issue | Prevention | Detection | Fix |
|-------|-----------|-----------|-----|
| Corrupted localStorage | Use try-catch | Console errors | Clear storage |
| Invalid API response | Validate content-type | Network tab | Check backend |
| Manual data editing | Don't edit manually | Test parse | Clear and re-login |
| Server errors as HTML | Check status codes | Inspect response | Fix backend |

---

## ✅ Current Status

**Fixed Files:**
- ✅ `lib/auth/AuthContext.tsx` - Added error handling
- ✅ Created `tmp_rovodev_clear_storage.html` - Debug tool
- ✅ Created `JSON_ERROR_TROUBLESHOOTING.md` - This guide

**What Happens Now:**
- Application will automatically detect corrupted JSON
- Invalid data will be cleared automatically
- User will be gracefully logged out
- No more cryptic JSON parse errors

---

*Last Updated: December 21, 2025*
