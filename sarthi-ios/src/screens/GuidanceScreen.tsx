import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { guidanceService } from '../services/guidanceService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { GuidanceResponse } from '../types';

export default function GuidanceScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<GuidanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await guidanceService.askGuidance({
        query: query.trim(),
        maxVerses: 5,
      });
      setResponse(result);
    } catch (err: any) {
      console.error('Error fetching guidance:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get guidance';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>What guidance do you seek?</Text>
        <TextInput
          style={styles.input}
          placeholder="Ask your question here... (e.g., How can I find inner peace?)"
          value={query}
          onChangeText={setQuery}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Seek Guidance</Text>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {response && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>Spiritual Guidance</Text>
            <Text style={styles.responseText}>{response.guidance}</Text>

            {response.verses_referenced && response.verses_referenced.length > 0 && (
              <View style={styles.versesContainer}>
                <Text style={styles.versesTitle}>Referenced Verses</Text>
                {response.verses_referenced.map((verse, index) => (
                  <View key={index} style={styles.verseItem}>
                    <Text style={styles.verseReference}>
                      Bhagavad Gita {verse.reference}
                    </Text>
                    <Text style={styles.verseTranslation}>{verse.translation}</Text>
                    {verse.purport && (
                      <Text style={styles.versePurport}>{verse.purport}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary[600],
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  responseContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  responseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  responseText: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  versesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  versesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  verseItem: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
  },
  verseReference: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.spiritual.blue.DEFAULT,
    marginBottom: spacing.sm,
  },
  verseTranslation: {
    fontSize: 15,
    color: colors.gray[900],
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  versePurport: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
});

