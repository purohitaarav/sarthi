import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { guidanceService } from '../services/guidanceService';
import GuidanceForm from '../components/GuidanceForm';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    try {
      const result = await guidanceService.askGuidance({
        query: query,
        maxVerses: 5,
      });

      if (result.success) {
        // Prepare history item
        const historyItem = {
          query: query,
          timestamp: new Date().toISOString(),
          response: {
            success: true,
            query: query,
            guidance: result.guidance,
            verses_referenced: result.verses_referenced,
            timestamp: new Date().toISOString(),
          }
        };

        // Save to History in AsyncStorage
        try {
          const HISTORY_KEY = '@sarthi_past_queries';
          const stored = await AsyncStorage.getItem(HISTORY_KEY);
          let history = stored ? JSON.parse(stored) : [];
          // Add to beginning of array
          history = [historyItem, ...history];
          await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (err) {
          console.error('Error saving to history:', err);
        }

        // Navigate to Response screen
        navigation.navigate('Response', {
          query: query,
          verses: result.verses_referenced,
          response: result.guidance,
          timestamp: historyItem.timestamp,
        });
      } else {
        Alert.alert('Error', 'Failed to get guidance. Please try again.');
      }
    } catch (err: any) {
      console.error('Error fetching guidance:', err);
      Alert.alert('Error', err.message || 'Failed to get guidance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#dbeafe', '#fef3c7']}
        style={styles.background}
      >
        <View style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <GuidanceForm onSubmit={handleSubmit} isLoading={loading} />

              {!loading && (
                <View style={styles.welcomeSection}>
                  <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeEmoji}>🙏</Text>
                    <Text style={styles.welcomeTitle}>Welcome to Sarthi</Text>
                    <Text style={styles.welcomeText}>
                      The Bhagavad Gita offers timeless wisdom for modern challenges.
                      Ask your question and find clarity in its verses.
                    </Text>
                    <View style={styles.footerInfo}>
                      <Text style={styles.footerText}>
                        Powered by the Bhagavad Gita and AI • <Text style={styles.highlightText}>653 verses</Text> available
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
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
  scrollContent: {
    paddingVertical: spacing.xl,
    flexGrow: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  welcomeSection: {
    width: '90%',
    marginTop: spacing.xxl,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  welcomeEmoji: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: spacing.xs,
  },
  welcomeText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  footerInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.1)',
    width: '100%',
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  highlightText: {
    color: colors.spiritual.blue.DEFAULT,
    fontWeight: '600',
  },
  omContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    opacity: 0.1,
  },
  omSymbol: {
    fontSize: 100,
    color: colors.spiritual.gold.DEFAULT,
  },
});
