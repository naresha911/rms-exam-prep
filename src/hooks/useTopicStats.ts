// useTopicStats — fetch and compute per-topic performance stats
import { useState, useCallback, useEffect } from 'react';
import { fetchTopicStats } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

interface TopicStat {
    topic_id: number;
    topic_name: string;
    subject_id: number;
    subject_name: string;
    questions_attempted: number;
    questions_correct: number;
    accuracy: number;
    last_attempted_at: string | null;
    strength: 'strong' | 'medium' | 'weak';
}

interface UseTopicStatsResult {
    topicStats: TopicStat[];
    weakTopics: TopicStat[];
    strongTopics: TopicStat[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Fetches student_topic_stats from Supabase and enriches with accuracy + strength labels.
 * Derives weak topics (< 60% accuracy) and strong topics (>= 80% accuracy).
 */
export const useTopicStats = (): UseTopicStatsResult => {
    const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAppStore();

    const fetchStats = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await fetchTopicStats(user.id);

            if (fetchError) {
                setError('Failed to load performance data.');
                return;
            }

            if (data && data.length > 0) {
                const enriched: TopicStat[] = (data as any[]).map((stat) => {
                    const accuracy =
                        stat.questions_attempted > 0
                            ? Math.round((stat.questions_correct / stat.questions_attempted) * 100)
                            : 0;

                    const strength: TopicStat['strength'] =
                        accuracy >= 80
                            ? 'strong'
                            : accuracy >= 60
                            ? 'medium'
                            : 'weak';

                    return {
                        topic_id: stat.topic_id,
                        topic_name: stat.topics?.name ?? 'Unknown Topic',
                        subject_id: stat.topics?.subjects?.id ?? 0,
                        subject_name: stat.topics?.subjects?.name ?? 'Unknown Subject',
                        questions_attempted: stat.questions_attempted,
                        questions_correct: stat.questions_correct,
                        accuracy,
                        last_attempted_at: stat.last_attempted_at,
                        strength,
                    };
                });

                // Sort by accuracy ascending so weakest topics come first
                enriched.sort((a, b) => a.accuracy - b.accuracy);
                setTopicStats(enriched);
            } else {
                setTopicStats([]);
            }
        } catch (e) {
            setError('Unexpected error fetching topic stats.');
            console.error('useTopicStats:', e);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const weakTopics = topicStats.filter((t) => t.strength === 'weak');
    const strongTopics = topicStats.filter((t) => t.strength === 'strong');

    return {
        topicStats,
        weakTopics,
        strongTopics,
        loading,
        error,
        refetch: fetchStats,
    };
};

export default useTopicStats;
