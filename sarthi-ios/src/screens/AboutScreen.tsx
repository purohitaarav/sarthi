import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Zap } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function AboutScreen() {
  const benefits = [
    'Easy-to-use interface for all users',
    'Secure and reliable service',
    'Access your data from anywhere, anytime',
    'Fast and responsive performance',
    'Regular updates with new features',
    'Dedicated support when you need it'
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>About Sarthi</Text>
          <Text style={styles.subtitle}>
            Your trusted companion for managing your digital life with ease and confidence
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What We Offer</Text>
            <Text style={styles.text}>
              Sarthi is designed to simplify your daily tasks and help you stay organized.
              Whether you're managing personal projects, keeping track of important information,
              or collaborating with others, we've got you covered.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose Us</Text>
            <View style={styles.benefitsCard}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Zap size={20} color={colors.primary[600]} style={styles.benefitIcon} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.gettingStartedCard}>
            <Text style={styles.gsTitle}>Getting Started</Text>
            <View style={styles.gsStep}>
              <Text style={styles.gsNumber}>1.</Text>
              <Text style={styles.gsText}>
                Install dependencies: <Text style={styles.code}>npm run install-deps</Text>
              </Text>
            </View>
            <View style={styles.gsStep}>
              <Text style={styles.gsNumber}>2.</Text>
              <Text style={styles.gsText}>
                Set up database: <Text style={styles.code}>npm run setup-db</Text>
              </Text>
            </View>
            <View style={styles.gsStep}>
              <Text style={styles.gsNumber}>3.</Text>
              <Text style={styles.gsText}>
                Start development: <Text style={styles.code}>npm run dev</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  container: {
    padding: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: colors.gray[600],
    marginBottom: spacing.xl,
    lineHeight: 26,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
  },
  benefitsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 15,
    color: colors.gray[700],
    flex: 1,
  },
  gettingStartedCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  gsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  gsStep: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  gsNumber: {
    fontWeight: '700',
    color: colors.gray[900],
    marginRight: spacing.sm,
  },
  gsText: {
    fontSize: 15,
    color: colors.gray[800],
    flex: 1,
  },
  code: {
    fontFamily: 'Courier',
    backgroundColor: colors.white,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});
