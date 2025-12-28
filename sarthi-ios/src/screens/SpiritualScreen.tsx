import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function SpiritualScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Spiritual Guidance Screen</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  subtext: {
    fontSize: 16,
    color: colors.gray[600],
    marginTop: spacing.md,
  },
});

