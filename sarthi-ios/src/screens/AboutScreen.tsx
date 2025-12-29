import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Zap, Info } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';

const AboutScreen = () => {
  const benefits = [
    'Easy-to-use interface for all users',
    'Secure and reliable service',
    'Access your data from anywhere, anytime',
    'Fast and responsive performance',
    'Regular updates with new features',
    'Dedicated support when you need it'
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#dbeafe', '#fef3c7']}
        style={styles.background}
      >
        <View style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.headerInfo}>
                <Info size={48} color={colors.spiritual.blue.DEFAULT} />
                <Text style={styles.subtitle}>
                  Your trusted companion for managing your digital life with ease and confidence
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>What We Offer</Text>
                <Text style={styles.paragraph}>
                  Sarthi is designed to simplify your daily tasks and help you stay organized.
                  Whether you're managing personal projects, keeping track of important information,
                  or collaborating with others, we've got you covered.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Why Choose Us</Text>
                <View style={styles.benefitsGrid}>
                  {benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Zap size={18} color={colors.spiritual.gold.DEFAULT} style={styles.benefitIcon} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.footerCard}>
                <Text style={styles.footerTitle}>Getting Started</Text>
                <View style={styles.stepItem}>
                  <Text style={styles.stepNumber}>1.</Text>
                  <Text style={styles.stepText}>Ask a question about life or spirituality.</Text>
                </View>
                <View style={styles.stepItem}>
                  <Text style={styles.stepNumber}>2.</Text>
                  <Text style={styles.stepText}>Receive guidance based on the Bhagavad Gita.</Text>
                </View>
                <View style={styles.stepItem}>
                  <Text style={styles.stepNumber}>3.</Text>
                  <Text style={styles.stepText}>Save and reflect on the wisdom received.</Text>
                </View>
                <View style={styles.versionInfo}>
                  <Text style={styles.versionText}>Built with React Native & Expo</Text>
                </View>
              </View>
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
};

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
    paddingHorizontal: spacing.md,
  },
  content: {
    gap: spacing.lg,
  },
  headerInfo: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  paragraph: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 24,
  },
  benefitsGrid: {
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
  footerCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    marginBottom: spacing.xxl,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  stepNumber: {
    fontWeight: '700',
    color: colors.spiritual.blue.DEFAULT,
    marginRight: spacing.sm,
  },
  stepText: {
    fontSize: 15,
    color: colors.gray[700],
    flex: 1,
  },
  versionInfo: {
    marginTop: spacing.xl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.1)',
    paddingTop: spacing.md,
  },
  versionText: {
    fontSize: 12,
    color: colors.gray[400],
    fontStyle: 'italic',
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

export default AboutScreen;
