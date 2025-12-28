import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Sparkles, Heart } from 'lucide-react-native';
import { guidanceService } from '../services/guidanceService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ChatItem {
  question: string;
  guidance: string;
  timestamp: string;
}

export default function SpiritualScreen() {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ChatItem[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSubmit = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setGuidance('');

    try {
      const response = await guidanceService.askGuidance({
        query: question.trim(),
        context: context.trim() || undefined,
      });

      setGuidance(response.guidance);
      setConversationHistory(prev => [...prev, {
        question: question,
        guidance: response.guidance,
        timestamp: response.timestamp,
      }]);

      setQuestion('');
      setContext('');

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (err: any) {
      console.error('Error getting guidance:', err);
      setError(err.response?.data?.message || 'Failed to get spiritual guidance.');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'How can I find inner peace in difficult times?',
    'What does the Bhagavad Gita teach about handling stress?',
    'How do I balance my duties with my personal desires?',
    'What is the path to self-realization?',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Sparkles size={32} color={colors.primary[600]} style={styles.headerIcon} />
              <Text style={styles.title}>Spiritual Guidance</Text>
            </View>
            <Text style={styles.subtitle}>
              Seek wisdom from the timeless teachings of the Bhagavad Gita
            </Text>
          </View>

          {/* Main Form */}
          <View style={styles.formCard}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Question</Text>
              <TextInput
                style={styles.textArea}
                value={question}
                onChangeText={setQuestion}
                placeholder="Ask for spiritual guidance..."
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Additional Context (Optional)</Text>
              <TextInput
                style={styles.input}
                value={context}
                onChangeText={setContext}
                placeholder="Provide any additional context..."
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.submitButton, loading && styles.disabledButton]}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <View style={styles.row}>
                  <Send size={18} color={colors.white} style={styles.sendIcon} />
                  <Text style={styles.submitButtonText}>Ask for Guidance</Text>
                </View>
              )}
            </TouchableOpacity>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>

          {/* Sample Questions */}
          {conversationHistory.length === 0 && (
            <View style={styles.samplesContainer}>
              <View style={styles.samplesHeader}>
                <Heart size={20} color={colors.primary[600]} style={styles.sampleIcon} />
                <Text style={styles.samplesTitle}>Sample Questions</Text>
              </View>
              <View style={styles.samplesGrid}>
                {sampleQuestions.map((sample, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setQuestion(sample)}
                    style={styles.sampleItem}
                  >
                    <Text style={styles.sampleText}>{sample}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Current Guidance */}
          {guidance ? (
            <View style={styles.guidanceCard}>
              <View style={styles.row}>
                <Sparkles size={24} color={colors.primary[600]} style={styles.sparkleIcon} />
                <Text style={styles.guidanceTitle}>Spiritual Guidance</Text>
              </View>
              <Text style={styles.guidanceText}>{guidance}</Text>
            </View>
          ) : null}

          {/* History */}
          {conversationHistory.length > 1 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Previous Guidance</Text>
              {conversationHistory.slice(0, -1).reverse().map((item, index) => (
                <View key={index} style={styles.historyCard}>
                  <Text style={styles.historyLabel}>Question:</Text>
                  <Text style={styles.historyText}>{item.question}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.historyLabel}>Guidance:</Text>
                  <Text style={styles.historyText}>{item.guidance}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerIcon: {
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.gray[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.gray[800],
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.gray[800],
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    marginRight: spacing.sm,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  samplesContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  samplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sampleIcon: {
    marginRight: spacing.sm,
  },
  samplesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
  },
  samplesGrid: {
    gap: spacing.sm,
  },
  sampleItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  sampleText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  guidanceCard: {
    backgroundColor: '#f5f3ff', // Light purple
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  sparkleIcon: {
    marginRight: spacing.sm,
  },
  guidanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  guidanceText: {
    fontSize: 16,
    color: colors.gray[800],
    lineHeight: 26,
  },
  historyContainer: {
    marginBottom: spacing.xl,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  historyLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 2,
  },
  historyText: {
    fontSize: 15,
    color: colors.gray[700],
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginBottom: spacing.md,
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray[400],
  },
});
