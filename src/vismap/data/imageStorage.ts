/**
 * ImageStorage - IndexedDB wrapper for storing employee images
 * Solves localStorage quota issues by using IndexedDB which has much larger storage (hundreds of MB)
 */

const DB_NAME = 'org_chart_images';
const STORE_NAME = 'employee_images';
const DB_VERSION = 1;

interface StoredImage {
  id: string;
  dataUrl: string;
  employeeId: string;
  timestamp: number;
}

/**
 * Initialize IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('employeeId', 'employeeId', { unique: false });
        console.log('ðŸ“¦ IndexedDB object store created');
      }
    };
  });
}

/**
 * Save image to IndexedDB
 */
export async function saveImage(employeeId: string, dataUrl: string): Promise<string> {
  try {
    const db = await openDB();
    const imageId = `img_${employeeId}_${Date.now()}`;
    
    const image: StoredImage = {
      id: imageId,
      dataUrl,
      employeeId,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Delete old images for this employee first
      const index = store.index('employeeId');
      const request = index.openCursor(IDBKeyRange.only(employeeId));
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };

      // Add new image
      const addRequest = store.add(image);
      
      addRequest.onsuccess = () => {
        console.log(`âœ… Image saved to IndexedDB: ${imageId}`);
        resolve(imageId);
      };
      
      addRequest.onerror = () => reject(addRequest.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error saving image to IndexedDB:', error);
    throw error;
  }
}

/**
 * Get image from IndexedDB by ID
 */
export async function getImage(imageId: string): Promise<string | null> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(imageId);
      
      request.onsuccess = () => {
        const result = request.result as StoredImage | undefined;
        resolve(result ? result.dataUrl : null);
      };
      
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error getting image from IndexedDB:', error);
    return null;
  }
}

/**
 * Get all images for an employee
 */
export async function getImagesByEmployeeId(employeeId: string): Promise<StoredImage[]> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('employeeId');
      const request = index.getAll(IDBKeyRange.only(employeeId));
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error getting images by employee ID:', error);
    return [];
  }
}

/**
 * Delete image from IndexedDB
 */
export async function deleteImage(imageId: string): Promise<void> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(imageId);
      
      request.onsuccess = () => {
        console.log(`ðŸ—‘ï¸ Image deleted from IndexedDB: ${imageId}`);
        resolve();
      };
      
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error deleting image from IndexedDB:', error);
    throw error;
  }
}

/**
 * Get storage usage statistics
 */
export async function getImageStorageStats(): Promise<{ count: number; sizeMB: number }> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const images = request.result as StoredImage[];
        const totalSize = images.reduce((sum, img) => sum + img.dataUrl.length, 0);
        const sizeMB = totalSize / (1024 * 1024);
        
        resolve({
          count: images.length,
          sizeMB
        });
      };
      
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return { count: 0, sizeMB: 0 };
  }
}

/**
 * Clear all images from IndexedDB
 */
export async function clearAllImages(): Promise<void> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log('ðŸ—‘ï¸ All images cleared from IndexedDB');
        resolve();
      };
      
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error clearing images:', error);
    throw error;
  }
}

/**
 * Get all image IDs currently stored in IndexedDB
 */
export async function getAllImageIds(): Promise<string[]> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      
      request.onsuccess = () => {
        resolve(request.result as string[]);
      };
      
      request.onerror = () => reject(request.error);
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error getting image IDs:', error);
    return [];
  }
}

/**
 * Verify if an image exists in IndexedDB
 */
export async function imageExists(imageId: string): Promise<boolean> {
  try {
    const image = await getImage(imageId);
    return image !== null;
  } catch (error) {
    return false;
  }
}

