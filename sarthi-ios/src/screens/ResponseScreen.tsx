import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { spacing } from '../theme/spacing';
import ResponseDisplay from '../components/ResponseDisplay';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

type ResponseScreenRouteProp = RouteProp<RootStackParamList, 'Response'>;

interface Props {
  route: ResponseScreenRouteProp;
}

export default function ResponseScreen({ route }: Props) {
  const { query, verses, response, timestamp } = route.params;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#dbeafe', '#fef3c7']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ResponseDisplay
            response={{
              query: query || '',
              guidance: response || '',
              verses_referenced: verses || [],
              timestamp: timestamp || new Date().toISOString()
            }}
          />
        </ScrollView>

        {/* Floating Om Symbol */}
        <View style={styles.omContainer} pointerEvents="none">
          <Text style={styles.omSymbol}>ॐ</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
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
