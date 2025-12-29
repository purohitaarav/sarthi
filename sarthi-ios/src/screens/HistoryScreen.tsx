import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, GuidanceResponse } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';
import { History, Trash2, ChevronRight, Sparkles } from 'lucide-react-native';

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

  const isFocused = useIsFocused();
  const STORAGE_KEY = '@sarthi_past_queries';

  useEffect(() => {
    if (isFocused) {
      loadPastQueries();
    }
  }, [isFocused]);

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
      // Navigate to the Response screen nested within HomeMain stack
      navigation.navigate('HomeMain' as any, {
        screen: 'Response',
        params: {
          response: pastQuery.response.guidance,
          query: pastQuery.query,
          verses: pastQuery.response.verses_referenced || [],
          timestamp: pastQuery.timestamp,
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#dbeafe', '#fef3c7']}
        style={styles.background}
      >
        <View style={styles.safeArea}>
          <View style={styles.headerRow}>
            <Text style={styles.headerSubtitle}>Revisit the wisdom shared with you</Text>
            {pastQueries.length > 0 && (
              <TouchableOpacity onPress={clearHistory} style={styles.clearIconButton}>
                <Trash2 size={20} color="#dc2626" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.centerContainer}>
                <Text style={styles.infoText}>Loading history...</Text>
              </View>
            ) : pastQueries.length === 0 ? (
              <View style={styles.emptyContainer}>
                <History size={64} color={colors.gray[300]} />
                <Text style={styles.emptyText}>No past queries yet</Text>
                <Text style={styles.emptySubtext}>
                  Your previous questions and guidance will appear here
                </Text>
                <TouchableOpacity
                  style={styles.askButton}
                  onPress={() => navigation.navigate('Home' as any)}
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
                        <Sparkles size={20} color={colors.spiritual.gold.DEFAULT} />
                      </View>
                      <View style={styles.queryContent}>
                        <Text style={styles.queryText} numberOfLines={2}>
                          {pastQuery.query}
                        </Text>
                        <Text style={styles.queryTime}>
                          {new Date(pastQuery.timestamp).toLocaleDateString()} at {new Date(pastQuery.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                      <ChevronRight size={20} color={colors.gray[300]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Floating Om Symbol */}
          <View style={styles.omContainer} pointerEvents="none">
            <Text style={styles.omSymbol}>ॐ</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  clearIconButton: {
    padding: spacing.sm,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[700],
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  askButton: {
    backgroundColor: colors.spiritual.blue.DEFAULT,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    shadowColor: colors.spiritual.blue.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  askButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  queriesList: {
    gap: spacing.md,
  },
  queryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  queryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  queryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  queryContent: {
    flex: 1,
  },
  queryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 4,
  },
  queryTime: {
    fontSize: 12,
    color: colors.gray[400],
  },
  omContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    opacity: 0.05,
  },
  omSymbol: {
    fontSize: 120,
    color: colors.spiritual.gold.DEFAULT,
  },
});
