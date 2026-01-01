import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { spacing } from '../theme/spacing';
import ResponseDisplay from '../components/ResponseDisplay';
import { colors } from '../theme/colors';

type ResponseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ResponseScreenRouteProp = RouteProp<RootStackParamList, 'Response'>;

interface Props {
  route: ResponseScreenRouteProp;
}

export default function ResponseScreen({ route }: Props) {
  const { query, verses, response, timestamp } = route.params;
  const navigation = useNavigation<ResponseScreenNavigationProp>(); // Use specialized nav prop

  const handleReflect = (queryText: string, time: string) => {
    navigation.replace('Reflections', {
      initialReflection: ``,
      query: queryText,
      timestamp: time,
      response: response,
      verses: verses
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ResponseDisplay
            response={{
              query: query || '',
              guidance: response || '',
              verses_referenced: verses || [],
              timestamp: timestamp || new Date().toISOString()
            }}
            onReflect={handleReflect}
          />
        </ScrollView>

        {/* Floating Om Symbol */}
        <View style={styles.omContainer} pointerEvents="none">
          <Text style={styles.omSymbol}>ॐ</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50], // Consistent warm off-white
  },
  content: {
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
    color: colors.gray[400], // Neutral gray
  },
});
