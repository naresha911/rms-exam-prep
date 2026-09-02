// AsyncStorage utility wrappers with type safety
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * Store a JSON-serializable value in AsyncStorage
 */
export const setStorageItem = async <T>(key: string, value: T): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Storage setItem failed:', key, e);
    }
};

/**
 * Retrieve and parse a JSON value from AsyncStorage
 */
export const getStorageItem = async <T>(key: string): Promise<T | null> => {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (raw == null) return null;
        return JSON.parse(raw) as T;
    } catch (e) {
        console.warn('Storage getItem failed:', key, e);
        return null;
    }
};

/**
 * Remove a key from AsyncStorage
 */
export const removeStorageItem = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.warn('Storage removeItem failed:', key, e);
    }
};

/**
 * Clear all app-specific storage
 */
export const clearAppStorage = async (): Promise<void> => {
    try {
        const keys = Object.values(STORAGE_KEYS);
        await AsyncStorage.multiRemove(keys);
    } catch (e) {
        console.warn('Storage clearAppStorage failed:', e);
    }
};

/**
 * Check if onboarding has been completed
 */
export const getOnboardingComplete = (): Promise<boolean | null> =>
    getStorageItem<boolean>(STORAGE_KEYS.onboardingComplete);

/**
 * Mark onboarding as complete
 */
export const setOnboardingComplete = (complete: boolean): Promise<void> =>
    setStorageItem(STORAGE_KEYS.onboardingComplete, complete);

/**
 * Get app settings
 */
export const getAppSettings = <T>(): Promise<T | null> =>
    getStorageItem<T>(STORAGE_KEYS.settings);

/**
 * Save app settings
 */
export const saveAppSettings = <T>(settings: T): Promise<void> =>
    setStorageItem(STORAGE_KEYS.settings, settings);

/**
 * Cache questions for offline use
 */
export const cacheQuestions = <T>(questions: T): Promise<void> =>
    setStorageItem(STORAGE_KEYS.cachedQuestions, questions);

/**
 * Get cached questions
 */
export const getCachedQuestions = <T>(): Promise<T | null> =>
    getStorageItem<T>(STORAGE_KEYS.cachedQuestions);
