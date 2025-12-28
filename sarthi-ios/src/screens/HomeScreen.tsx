import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Zap, Users, Settings, BookOpen, ArrowRight } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }: any) {
  const benefits = [
    {
      icon: Zap,
      title: 'Simple & Intuitive',
      description: 'Designed with a clean interface that makes managing your tasks a breeze',
      color: '#2563eb',
      bg: '#eff6ff',
    },
    {
      icon: Users,
      title: 'Collaborate with Ease',
      description: 'Work together with your team in real-time',
      color: '#16a34a',
      bg: '#f0fdf4',
    },
    {
      icon: Settings,
      title: 'Customizable',
      description: 'Tailor the experience to fit your specific needs',
      color: '#9333ea',
      bg: '#faf5ff',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome to Sarthi</Text>
          <Text style={styles.heroSubtitle}>
            Your personal guide to getting things done, staying organized, and achieving more every day
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Guidance')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('About')}
            >
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={[styles.iconContainer, { backgroundColor: benefit.bg }]}>
                <benefit.icon size={32} color={benefit.color} />
              </View>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDescription}>{benefit.description}</Text>
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <LinearGradient
          colors={['#f0f9ff', '#eff6ff']}
          style={styles.cta}
        >
          <BookOpen size={48} color={colors.primary[600]} style={styles.ctaIcon} />
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of users who are already simplifying their workflow with Sarthi
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Guidance')}
          >
            <Text style={styles.ctaButtonText}>Seek Guidance</Text>
            <ArrowRight size={20} color={colors.white} style={styles.ctaArrow} />
          </TouchableOpacity>
        </LinearGradient>
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
  hero: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    fontSize: 18,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 26,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: colors.gray[700],
    fontWeight: '700',
    fontSize: 16,
  },
  benefitsGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  benefitCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[100],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  benefitDescription: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  cta: {
    marginHorizontal: spacing.lg,
    padding: spacing.xxl,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  ctaIcon: {
    marginBottom: spacing.md,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: colors.primary[600],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
  },
  ctaButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  ctaArrow: {
    marginLeft: spacing.sm,
  },
});
