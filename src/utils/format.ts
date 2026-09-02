// Format utilities for the AISSEE preparation app

/**
 * Format seconds into MM:SS display string
 */
export const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Format seconds into a human-readable duration string
 * e.g. "2h 30m" or "45m 30s"
 */
export const formatDuration = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return '0s';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0 && seconds > 0) return `${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
};

/**
 * Format a number as a percentage string
 * e.g. 75.666 → "75.7%"
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * Format a score value
 * e.g. 285.5 → "285.5" or 285 → "285"
 */
export const formatScore = (score: number | null | undefined): string => {
    if (score == null) return '0';
    return score % 1 === 0 ? score.toString() : score.toFixed(1);
};

/**
 * Format accuracy from correct/total questions
 */
export const formatAccuracy = (correct: number, total: number): string => {
    if (total === 0) return '0%';
    return `${Math.round((correct / total) * 100)}%`;
};

/**
 * Format a date string to a friendly display format
 * e.g. "2026-01-15" → "15 Jan 2026"
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

/**
 * Format a relative time string
 * e.g. "2 hours ago", "3 days ago"
 */
export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
};

/**
 * Format XP number with K suffix for large values
 * e.g. 1500 → "1.5K", 999 → "999"
 */
export const formatXP = (xp: number): string => {
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
    return xp.toString();
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format difficulty label with proper display name
 */
export const formatDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): string => {
    const labels = {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
    };
    return labels[difficulty] || difficulty;
};
