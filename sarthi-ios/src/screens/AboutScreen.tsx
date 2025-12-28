import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About Sarthi</Text>
        <Text style={styles.description}>
          Your trusted companion for managing your digital life with ease and confidence
        </Text>
        <Text style={styles.text}>
          Sarthi is designed to simplify your daily tasks and help you stay organized.
          Whether you're managing personal projects, keeping track of important information,
          or collaborating with others, we've got you covered.
        </Text>
        <Text style={styles.footer}>
          © 2025 Sarthi. Built with React Native, Expo, and Express.
        </Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 18,
    color: colors.gray[600],
    marginBottom: spacing.lg,
  },
  text: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  footer: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

