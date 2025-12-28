import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import ResponseDisplay from '../components/ResponseDisplay';
import { colors, gradients } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';

type ResponseScreenRouteProp = RouteProp<RootStackParamList, 'Response'>;
type ResponseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Response'>;

interface Props {
  route: ResponseScreenRouteProp;
  navigation: ResponseScreenNavigationProp;
}

export default function ResponseScreen({ route, navigation }: Props) {
  const { response } = route.params;

  if (!response) {
    return (
      <View style={styles.centered}>
        <Text>No response data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[gradients.serene[0], gradients.serene[1]] as any}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ResponseDisplay response={response} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to History</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.md,
    marginBottom: spacing.xxl,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  backButtonText: {
    color: colors.primary[600],
    fontWeight: '700',
    fontSize: 16,
  },
});
