import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, GuidanceResponse } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

interface PastQuery {
  query: string;
  timestamp: string;
  response?: GuidanceResponse;
}

export default function HistoryScreen({ navigation }: Props) {
  const [pastQueries, setPastQueries] = useState<PastQuery[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = '@sarthi_past_queries';

  useEffect(() => {
    loadPastQueries();
  }, []);

  const loadPastQueries = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPastQueries(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading past queries:', err);
      Alert.alert('Error', 'Failed to load past queries');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all past queries?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setPastQueries([]);
            } catch (err) {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const handleQueryPress = (pastQuery: PastQuery) => {
    if (pastQuery.response) {
      navigation.navigate('Response', { response: pastQuery.response });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Past Conversations</Text>
          {pastQueries.length > 0 && (
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {pastQueries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No past queries yet</Text>
            <Text style={styles.emptySubtext}>
              Your previous questions and guidance will appear here
            </Text>
            <TouchableOpacity
              style={styles.askButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.askButtonText}>Ask a Question</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.queriesList}>
            {pastQueries.map((pastQuery, index) => (
              <TouchableOpacity
                key={index}
                style={styles.queryCard}
                onPress={() => handleQueryPress(pastQuery)}
                activeOpacity={0.7}
              >
                <View style={styles.queryCardHeader}>
                  <View style={styles.queryIcon}>
                    <Text style={styles.queryIconText}>🙏</Text>
                  </View>
                  <View style={styles.queryContent}>
                    <Text style={styles.queryText} numberOfLines={2}>
                      {pastQuery.query}
                    </Text>
                    <Text style={styles.queryTime}>
                      {new Date(pastQuery.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>
                {pastQuery.response && (
                  <View style={styles.responsePreview}>
                    <Text style={styles.responsePreviewText} numberOfLines={2}>
                      {pastQuery.response.guidance}
                    </Text>
                    {pastQuery.response.verses_referenced &&
                      pastQuery.response.verses_referenced.length > 0 && (
                        <Text style={styles.versesCount}>
                          {pastQuery.response.verses_referenced.length} verse
                          {pastQuery.response.verses_referenced.length !== 1 ? 's' : ''} referenced
                        </Text>
                      )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  clearButton: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  askButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  askButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  queriesList: {
    gap: spacing.md,
  },
  queryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  queryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  queryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.spiritual.gold.DEFAULT + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  queryIconText: {
    fontSize: 20,
  },
  queryContent: {
    flex: 1,
  },
  queryText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  queryTime: {
    fontSize: 12,
    color: colors.gray[500],
  },
  chevron: {
    fontSize: 24,
    color: colors.gray[400],
    marginLeft: spacing.sm,
  },
  responsePreview: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  responsePreviewText: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  versesCount: {
    fontSize: 12,
    color: colors.spiritual.blue.DEFAULT,
    fontWeight: '500',
  },
});

