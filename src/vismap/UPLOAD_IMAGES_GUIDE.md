# 📷 Image Upload Feature - Complete Guide

## ✅ What's New

Image uploads are now **fully enabled** and stored in **IndexedDB** (hundreds of MB storage) instead of localStorage (5MB limit). This solves the QuotaExceededError issue!

## 🎯 How It Works

### Upload Flow
1. Open **Data Editor** (click "Edit Data" button)
2. Find the employee row you want to add a photo to
3. Click the **📷 button** in the Image column
4. Select an image file (max 5MB per image)
5. Image is uploaded to IndexedDB and shows as "📷 Uploaded Image" in blue
6. Click **Save** to persist changes

### Storage Architecture
- **IndexedDB**: Stores actual image data (base64) - much larger capacity
- **localStorage**: Stores only references like `indexeddb:img_1_1760682231005`
- **Auto-cleanup**: Broken references are automatically cleaned on app load

## 🔧 Features

### Upload Button (📷)
- Located next to the Image URL input field
- Accepts any image file (jpg, png, gif, etc)
- Max file size: 5MB per image
- Shows upload progress toast

### Visual Indicators
- **Blue background**: Indicates uploaded image (stored in IndexedDB)
- **📷 Uploaded Image**: Shows in input field (read-only)
- **Storage stats**: Shows count and size in top-right corner

### Clear Images Button
- Only appears when uploaded images exist
- Shows count and total size: "Clear Images (3)"
- Clears ALL uploaded images from IndexedDB
- Removes references from employee data
- Useful for freeing up storage space

## 🛠️ Technical Details

### Files Created/Modified
1. **`/data/imageStorage.ts`** - NEW
   - IndexedDB wrapper for image storage
   - Functions: saveImage, getImage, clearAllImages, etc.

2. **`/components/ImageLoader.tsx`** - NEW
   - Smart image loader component
   - Handles both URLs and IndexedDB references
   - Auto-fallback for missing images
   - Silent error handling

3. **`/data/dataManager.ts`** - UPDATED
   - Added `cleanupBrokenImageRefs()` function
   - Auto-cleanup on app load
   - Removes broken `indexeddb:` references

4. **`/components/DataEditor.tsx`** - UPDATED
   - Re-enabled upload button
   - Added IndexedDB storage stats
   - Added "Clear Images" button
   - Updated export to exclude IndexedDB refs

5. **`/components/OrgChartCard.tsx`** - UPDATED
   - Uses ImageLoader instead of <img>
   - Supports IndexedDB references

### Storage Format
```typescript
// Employee data in localStorage
{
  id: "1",
  name: "John Doe",
  imageUrl: "indexeddb:img_1_1760682231005"  // Reference to IndexedDB
}

// Actual image in IndexedDB
{
  id: "img_1_1760682231005",
  dataUrl: "data:image/png;base64,iVBORw0KGgo...",  // Full base64
  employeeId: "1",
  timestamp: 1760682231005
}
```

### Auto-Cleanup System
- Runs on app load
- Checks all `indexeddb:` references
- Verifies image exists in IndexedDB
- Removes broken references automatically
- No console spam (silent cleanup)

## 📊 Storage Monitoring

### localStorage Stats (💾)
- Shows percentage used
- Green < 60%, Amber 60-80%, Red > 80%
- Hover for exact MB usage

### IndexedDB Stats (📷)
- Shows count of uploaded images
- Shows total size in MB
- Only appears when images exist
- Hover for details

## 🚨 Error Handling

### Missing Images
- **Symptom**: Image URL shows `indexeddb:img_xxx` but image not found
- **Cause**: Image was deleted or never uploaded
- **Fix**: Automatic cleanup removes broken reference
- **Result**: Card shows default background (no image)

### Upload Failures
- **File too large**: Shows error, suggests max 5MB
- **Storage full**: Shows error in console
- **Read error**: Shows error toast

## 💡 Best Practices

1. **Use URLs for remote images**: Paste URL directly
2. **Upload for local images**: Use 📷 button
3. **Keep images < 5MB**: Compress if needed
4. **Monitor storage**: Check stats in top-right
5. **Clear unused images**: Use "Clear Images" button periodically

## 🔄 Migration from Old System

Old base64 images in localStorage are automatically stripped on load to prevent quota errors. If you had uploaded images before this update, you'll need to re-upload them.

## 🎉 Benefits

✅ No more QuotaExceededError  
✅ Upload much larger images  
✅ Store many more employee photos  
✅ Automatic cleanup of broken refs  
✅ Better performance (smaller localStorage)  
✅ Visual feedback for uploaded vs URL images  
✅ Easy bulk cleanup with one button  

---

**Last Updated**: January 2025  
**Version**: 2.0 - IndexedDB Storage
