import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, GuidanceResponse } from '../types';
import { guidanceService } from '../services/guidanceService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface PastQuery {
  query: string;
  timestamp: string;
  response?: GuidanceResponse;
}

export default function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pastQueries, setPastQueries] = useState<PastQuery[]>([]);

  const STORAGE_KEY = '@sarthi_past_queries';

  useEffect(() => {
    loadPastQueries();
  }, []);

  const loadPastQueries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPastQueries(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading past queries:', err);
    }
  };

  const savePastQuery = async (query: string, response: GuidanceResponse) => {
    try {
      const newQuery: PastQuery = {
        query,
        timestamp: new Date().toISOString(),
        response,
      };
      const updated = [newQuery, ...pastQueries].slice(0, 10); // Keep last 10
      setPastQueries(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving past query:', err);
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);

    const requestQuery = query.trim();
    const startTime = Date.now();

    try {
      const result = await guidanceService.askGuidance({
        query: requestQuery,
        maxVerses: 5,
      });

      await savePastQuery(requestQuery, result);

      // Navigate to response screen with the result
      navigation.navigate('Response', { response: result });
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error('Error fetching guidance:', err);
      console.error('Request duration:', duration, 'ms');

      let errorMessage = 'Failed to get guidance. Please try again.';

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. The AI service is taking longer than expected. Please try again with a simpler query.';
      } else if (err.response?.status === 500) {
        const errorData = err.response?.data;
        if (errorData?.error?.includes('no such table') || errorData?.error?.includes('SQLITE_ERROR')) {
          errorMessage = 'The server database is not fully set up. Please contact the administrator.';
        } else if (errorData?.error) {
          errorMessage = `Server error: ${errorData.error}. Please try again later.`;
        } else {
          errorMessage = 'The server encountered an error. Please try again later.';
        }
      } else if (err.response?.status === 503) {
        errorMessage = 'AI service is currently unavailable. Please try again later.';
      } else if (err.response?.status === 404) {
        errorMessage = 'No relevant verses found for your query. Try different keywords.';
      } else if (err.response?.status === 504) {
        errorMessage = 'The server took too long to respond. Please try again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "How can I find inner peace?",
    "What is my dharma?",
    "How to deal with anxiety?",
    "How to overcome fear?",
    "What does the Gita say about karma?",
  ];

  const handleSampleClick = (sample: string) => {
    setQuery(sample);
  };

  const handlePastQueryClick = (pastQuery: PastQuery) => {
    if (pastQuery.response) {
      navigation.navigate('Response', { response: pastQuery.response });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Spiritual Guidance</Text>
          <Text style={styles.headerSubtitle}>
            Seek wisdom from the Bhagavad Gita with AI-powered guidance
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>What guidance do you seek?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ask your question here... (e.g., How can I find inner peace?)"
            value={query}
            onChangeText={setQuery}
            multiline
            numberOfLines={4}
            editable={!loading}
            placeholderTextColor={colors.gray[400]}
          />

          <TouchableOpacity
            style={[styles.submitButton, (loading || !query.trim()) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.white} size="small" />
                <Text style={styles.submitButtonText}>Seeking Wisdom...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Seek Guidance</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sample Queries */}
        <View style={styles.samplesContainer}>
          <Text style={styles.samplesLabel}>Try asking:</Text>
          <View style={styles.samplesGrid}>
            {sampleQueries.map((sample, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.sampleButton, loading && styles.sampleButtonDisabled]}
                onPress={() => handleSampleClick(sample)}
                disabled={loading}
              >
                <Text style={styles.sampleButtonText}>{sample}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Unable to Provide Guidance</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => setError(null)}
            >
              <Text style={styles.errorButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Past Queries */}
        {pastQueries.length > 0 && (
          <View style={styles.pastQueriesContainer}>
            <View style={styles.pastQueriesHeader}>
              <Text style={styles.pastQueriesTitle}>Recent Queries</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {pastQueries.slice(0, 3).map((pastQuery, index) => (
              <TouchableOpacity
                key={index}
                style={styles.pastQueryItem}
                onPress={() => handlePastQueryClick(pastQuery)}
              >
                <Text style={styles.pastQueryText} numberOfLines={2}>
                  {pastQuery.query}
                </Text>
                <Text style={styles.pastQueryTime}>
                  {new Date(pastQuery.timestamp).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Footer Info */}
        {!error && pastQueries.length === 0 && (
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              🙏 Welcome to Sarthi - Your Spiritual Guide
            </Text>
            <Text style={styles.footerSubtext}>
              Powered by the Bhagavad Gita and AI • 653 verses available
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbeafe', // gradient-serene background
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
    color: colors.gray[800],
  },
  submitButton: {
    backgroundColor: colors.primary[600],
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  samplesContainer: {
    marginBottom: spacing.lg,
  },
  samplesLabel: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  samplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  sampleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.spiritual.blue.DEFAULT + '4D', // 30% opacity
    borderRadius: 20,
  },
  sampleButtonDisabled: {
    opacity: 0.5,
  },
  sampleButtonText: {
    fontSize: 14,
    color: colors.spiritual.blue.DEFAULT,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: spacing.md,
  },
  errorButton: {
    backgroundColor: '#dc2626',
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  pastQueriesContainer: {
    marginTop: spacing.lg,
  },
  pastQueriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pastQueriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '500',
  },
  pastQueryItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pastQueryText: {
    fontSize: 15,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  pastQueryTime: {
    fontSize: 12,
    color: colors.gray[500],
  },
  footerContainer: {
    backgroundColor: colors.white + '80', // 50% opacity
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.spiritual.blue.DEFAULT + '33', // 20% opacity
  },
  footerText: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.gray[500],
  },
});
