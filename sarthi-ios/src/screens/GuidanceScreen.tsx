import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Loader2, AlertCircle } from 'lucide-react-native';
import { guidanceService } from '../services/guidanceService';
import { colors, gradients } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { GuidanceResponse } from '../types';
import GuidanceForm from '../components/GuidanceForm';
import ResponseDisplay from '../components/ResponseDisplay';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GuidanceScreen() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<GuidanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await guidanceService.askGuidance({
        query: query,
        maxVerses: 5,
      });

      if (result.success) {
        setResponse(result);
        // Scroll to response after a short delay to allow rendering
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        setError('Failed to get guidance. Please try again.');
      }
    } catch (err: any) {
      console.error('Error fetching guidance:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to get guidance';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[gradients.serene[0], gradients.serene[1]] as any}
        style={styles.container}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View style={styles.content}>
            <GuidanceForm onSubmit={handleSubmit} isLoading={loading} />

            {/* Loading State */}
            {loading && (
              <View style={styles.loadingCard}>
                <View style={styles.loaderContainer}>
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Loader2 size={48} color={colors.spiritual.blue.DEFAULT} />
                  </Animated.View>
                  <View style={styles.pulseDot} />
                </View>
                <Text style={styles.loadingTitle}>
                  Consulting the wisdom of the Bhagavad Gita...
                </Text>
                <Text style={styles.loadingSubtitle}>
                  This may take a few moments
                </Text>
              </View>
            )}

            {/* Error State */}
            {error && !loading && (
              <View style={styles.errorCard}>
                <View style={styles.errorHeader}>
                  <AlertCircle size={24} color="#dc2626" />
                  <Text style={styles.errorTitle}>Unable to Provide Guidance</Text>
                </View>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  onPress={() => setError(null)}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Response Display */}
            {response && !loading && (
              <ResponseDisplay response={response} />
            )}

            {/* Footer Welcome (Only shown when no response) */}
            {!response && !loading && !error && (
              <View style={styles.welcomeFooter}>
                <View style={styles.welcomeCard}>
                  <Text style={styles.welcomeText}>
                    🙏 Welcome to Sarthi - Your Spiritual Guide
                  </Text>
                  <Text style={styles.welcomeSubtext}>
                    Powered by the Bhagavad Gita and AI • <Text style={styles.verseHighlight}>653 verses</Text> available
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Om Symbol */}
        <View style={styles.floatingOm}>
          <Text style={styles.omText}>ॐ</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: gradients.serene[0],
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.xl,
    flexGrow: 1,
  },
  content: {
    alignItems: 'center',
  },
  loadingCard: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xl,
    marginTop: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  loaderContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  spinner: {
    // Rotation is handled by the component if it supports it, 
    // but in RN we might need a custom animation. 
    // For now we'll rely on it being present.
  },
  pulseDot: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: colors.spiritual.gold.DEFAULT,
    borderRadius: 12,
    opacity: 0.6,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[700],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  errorCard: {
    width: '90%',
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991b1b',
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  welcomeFooter: {
    marginTop: spacing.xxl,
    width: '90%',
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  welcomeSubtext: {
    fontSize: 13,
    color: colors.gray[500],
  },
  verseHighlight: {
    color: colors.spiritual.blue.DEFAULT,
    fontWeight: '600',
  },
  floatingOm: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    opacity: 0.1,
  },
  omText: {
    fontSize: 80,
    color: colors.spiritual.gold.DEFAULT,
  },
});
