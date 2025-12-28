import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, GuidanceResponse } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type ResponseScreenRouteProp = RouteProp<RootStackParamList, 'Response'>;
type ResponseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Response'>;

interface Props {
  route: ResponseScreenRouteProp;
  navigation: ResponseScreenNavigationProp;
}

export default function ResponseScreen({ route, navigation }: Props) {
  const { response } = route.params;
  const [expandedVerses, setExpandedVerses] = useState<{ [key: number]: boolean }>({});

  const toggleVerse = (index: number) => {
    setExpandedVerses(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!response) {
    return (
      <View style={styles.container}>
        <Text>No response data available</Text>
      </View>
    );
  }

  const { query, guidance, verses_referenced, timestamp } = response;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Query Display */}
        <View style={styles.queryContainer}>
          <Text style={styles.queryLabel}>Your Question:</Text>
          <Text style={styles.queryText}>{query}</Text>
        </View>

        {/* Guidance Response */}
        <View style={styles.guidanceContainer}>
          <View style={styles.guidanceHeader}>
            <Text style={styles.guidanceTitle}>Spiritual Guidance</Text>
          </View>
          <Text style={styles.guidanceText}>{guidance}</Text>
          <View style={styles.timestampContainer}>
            <Text style={styles.timestampText}>
              Received: {new Date(timestamp).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Referenced Verses */}
        {verses_referenced && verses_referenced.length > 0 && (
          <View style={styles.versesContainer}>
            <View style={styles.versesHeader}>
              <Text style={styles.versesTitle}>Referenced Verses</Text>
            </View>

            {verses_referenced.map((verse, index) => (
              <TouchableOpacity
                key={index}
                style={styles.verseCard}
                onPress={() => toggleVerse(index)}
                activeOpacity={0.7}
              >
                <View style={styles.verseHeader}>
                  <View style={styles.verseHeaderLeft}>
                    <View style={styles.verseNumberBadge}>
                      <Text style={styles.verseNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.verseReference}>
                      Bhagavad Gita {verse.reference}
                    </Text>
                  </View>
                  <Text style={styles.expandIcon}>
                    {expandedVerses[index] ? '▲' : '▼'}
                  </Text>
                </View>

                <View style={styles.verseContent}>
                  <View style={styles.translationContainer}>
                    <Text style={styles.translationLabel}>Translation</Text>
                    <Text style={styles.translationText}>{verse.translation}</Text>
                  </View>

                  {expandedVerses[index] && (
                    <View style={styles.purportContainer}>
                      <Text style={styles.purportLabel}>Purport</Text>
                      <Text style={styles.purportText}>
                        {verse.purport || 'No purport available.'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Verse Count Badge */}
            <View style={styles.verseCountContainer}>
              <View style={styles.verseCountBadge}>
                <Text style={styles.verseCountText}>
                  {verses_referenced.length} verse{verses_referenced.length !== 1 ? 's' : ''} referenced
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Ask Another Question</Text>
        </TouchableOpacity>
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
  queryContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.spiritual.blue.DEFAULT,
  },
  queryLabel: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  queryText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.gray[900],
  },
  guidanceContainer: {
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
  guidanceHeader: {
    marginBottom: spacing.md,
  },
  guidanceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  guidanceText: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  timestampContainer: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  timestampText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  versesContainer: {
    backgroundColor: '#fef3c7', // gradient-serene gold tint
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.spiritual.gold.DEFAULT + '4D', // 30% opacity
  },
  versesHeader: {
    marginBottom: spacing.lg,
  },
  versesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  verseCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.spiritual.gold.DEFAULT,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  verseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verseNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  verseNumberText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  verseReference: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.spiritual.blue.DEFAULT,
    flex: 1,
  },
  expandIcon: {
    fontSize: 12,
    color: colors.gray[400],
  },
  verseContent: {
    gap: spacing.md,
  },
  translationContainer: {
    marginBottom: spacing.sm,
  },
  translationLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  translationText: {
    fontSize: 15,
    color: colors.gray[900],
    fontWeight: '500',
    lineHeight: 22,
  },
  purportContainer: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  purportLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  purportText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  verseCountContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  verseCountBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  verseCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.spiritual.blue.DEFAULT,
  },
  backButton: {
    backgroundColor: colors.primary[600],
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

