import * as FileSystem from "expo-file-system/legacy";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { getBytes, getStorage, ref } from "firebase/storage";
import { firebaseConfig } from "../config/firebase";

// Cache paths - simplified to work with available APIs
// Files will be cached in the app's document directory
const CACHE_DIR = FileSystem.cacheDirectory + "kreds-ads/";
const METADATA_FILE = FileSystem.cacheDirectory + "kreds-ads-meta.json";

// Ad types
export interface Ad {
  id: string;
  type: "image" | "video" | "gif";
  url: string;
  active: boolean;
  version: number;
  link: string;
  cachePath?: string;
}

interface AdCacheMetadata {
  adId: string;
  version: number;
  timestamp: number;
  filePath: string;
}

// Export db and storage for use in components
export { db, storage };

// New: listen to an ad in real-time

export function listenToAd(adKey: string, callback: (ad: Ad | null) => void) {
  if (!db) return () => {};

  const docRef = doc(db, "ads", adKey);
  const unsubscribe = onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.active) {
        const ad: Ad = {
          id: docSnap.id,
          type: data.type,
          url: data.url,
          link: data.link,
          active: data.active,
          version: data.version,
        };

        // download/cache the ad
        const result = await downloadAndCacheAd(ad);
        if (result.success) {
          ad.cachePath = result.cachePath;
        }

        callback(ad);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });

  return unsubscribe;
}

// Firebase initialization
let app: any;
let db: any;
let storage: any;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

/**
 * Initialize cache directory
 */
async function initializeCacheDir() {
  try {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  } catch (error) {
    // Ignore "directory already exists"
    if (!String(error).includes("EEXIST")) {
      console.error("Error initializing cache directory:", error);
    }
  }
}

/**
 * Get cache metadata
 */
async function getCacheMetadata(): Promise<Record<string, AdCacheMetadata>> {
  try {
    const metadataInfo = await FileSystem.getInfoAsync(METADATA_FILE);
    if (metadataInfo.exists) {
      const content = await FileSystem.readAsStringAsync(METADATA_FILE);
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading cache metadata:", error);
  }
  return {};
}

/**
 * Save cache metadata
 */
async function saveCacheMetadata(metadata: Record<string, AdCacheMetadata>) {
  try {
    await FileSystem.writeAsStringAsync(
      METADATA_FILE,
      JSON.stringify(metadata, null, 2)
    );
  } catch (error) {
    console.error("Error saving cache metadata:", error);
  }
}

/**
 * Download and cache ad file
 */
async function downloadAndCacheAd(
  ad: Ad
): Promise<{ success: boolean; cachePath?: string; error?: string }> {
  try {
    await initializeCacheDir();
    const metadata = await getCacheMetadata();

    // Check if ad is already cached and up-to-date
    const cacheKey = `ad_${ad.id}`;
    const cachedMeta = metadata[cacheKey];

    if (cachedMeta && cachedMeta.version === ad.version) {
      const fileInfo = await FileSystem.getInfoAsync(cachedMeta.filePath);
      if (fileInfo.exists) {
        return { success: true, cachePath: cachedMeta.filePath };
      }
    }

    // Download file from Firebase Storage
    // if (!ad.url.startsWith("gs://")) {
    //   return {
    //     success: false,
    //     error: "Invalid Firebase Storage URL",
    //   };
    // }

    // Allow external URLs without caching
    if (!ad.url.startsWith("gs://")) {
      return {
        success: true,
        cachePath: ad.url, // Just return the remote link
      };
    }

    // Parse gs:// URL to get bucket and path
    const gsUrl = ad.url;
    const bucketPath = gsUrl.replace("gs://", "").split("/");
    const storagePath = bucketPath.slice(1).join("/");

    const storageRef = ref(storage, storagePath);
    const fileBytes = await getBytes(storageRef);

    // Determine file extension from URL
    const extension = ad.url.split(".").pop()?.split("?")[0] || "bin";
    const fileName = `${ad.id}_v${ad.version}.${extension}`;
    const cachePath = `${CACHE_DIR}${fileName}`;

    // Save file to cache
    await FileSystem.writeAsStringAsync(
      cachePath,
      Buffer.from(fileBytes).toString("base64"),
      { encoding: "base64" }
    );

    // Update metadata
    metadata[cacheKey] = {
      adId: ad.id,
      version: ad.version,
      timestamp: Date.now(),
      filePath: cachePath,
    };

    await saveCacheMetadata(metadata);

    return { success: true, cachePath };
  } catch (error) {
    console.error("Error downloading and caching ad:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch active ad from Firestore
 */
export async function fetchActiveAd(adKey: string): Promise<Ad | null> {
  try {
    if (!db) {
      console.error("Firebase not initialized");
      return null;
    }

    const docRef = doc(db, "ads", adKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.active) {
        const ad: Ad = {
          id: docSnap.id,
          type: data.type,
          url: data.url,
          link: data.link,
          active: data.active,
          version: data.version,
        };

        // Download and cache the ad
        const result = await downloadAndCacheAd(ad);
        if (result.success) {
          ad.cachePath = result.cachePath;
          return ad;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching ad from Firestore:", error);
    return null;
  }
}

/**
 * Fetch all active ads
 */
export async function fetchAllActiveAds(): Promise<Ad[]> {
  try {
    if (!db) {
      console.error("Firebase not initialized");
      return [];
    }

    const q = query(collection(db, "ads"), where("active", "==", true));
    const querySnapshot = await getDocs(q);
    const ads: Ad[] = [];

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const ad: Ad = {
        id: docSnap.id,
        type: data.type,
        url: data.url,
        link: data.link,
        active: data.active,
        version: data.version,
      };

      // Download and cache the ad
      const result = await downloadAndCacheAd(ad);
      if (result.success) {
        ad.cachePath = result.cachePath;
        ads.push(ad);
      }
    }

    return ads;
  } catch (error) {
    console.error("Error fetching all active ads:", error);
    return [];
  }
}

/**
 * Get cached ad by ID (for offline use)
 */
export async function getCachedAd(adId: string): Promise<string | null> {
  try {
    const metadata = await getCacheMetadata();
    const cacheKey = `ad_${adId}`;
    const cachedMeta = metadata[cacheKey];

    if (cachedMeta) {
      const fileInfo = await FileSystem.getInfoAsync(cachedMeta.filePath);
      if (fileInfo.exists) {
        return cachedMeta.filePath;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting cached ad:", error);
    return null;
  }
}
