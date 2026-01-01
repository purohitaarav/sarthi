import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons'; // Icons
import { guidanceService } from '../services/guidanceService';
import GuidanceForm from '../components/GuidanceForm';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function HomeScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [selectedScripture, setSelectedScripture] = useState('gita');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scriptures = [
    { label: "🕉️ Bhagavad Gita", value: "gita" },
    { label: "✝️ Bible", value: "bible" },
    { label: "☪️ Quran", value: "quran" },
    { label: "🕍 Torah", value: "torah" }
  ];

  const handleSelectScripture = (value: string) => {
    setSelectedScripture(value);
    setIsDropdownOpen(false);
  };

  const getSelectedLabel = () => {
    return scriptures.find(s => s.value === selectedScripture)?.label || "Select Source";
  };

  // ... (keeping handleSubmit unchanged)

  const getScriptureName = (value: string) => {
    switch (value) {
      case 'bible': return 'Bible';
      case 'quran': return 'Quran';
      case 'torah': return 'Torah';
      default: return 'Scripture';
    }
  };

  const handleSubmit = async (query: string) => {
    setLoading(true);
    try {
      const result = await guidanceService.askGuidance({
        query: query,
        maxVerses: 5,
      });

      if (result.success) {
        // Prepare history item
        const historyItem = {
          query: query,
          timestamp: new Date().toISOString(),
          response: {
            success: true,
            query: query,
            guidance: result.guidance,
            verses_referenced: result.verses_referenced,
            timestamp: new Date().toISOString(),
          }
        };

        // Save to History in AsyncStorage
        try {
          const HISTORY_KEY = '@sarthi_past_queries';
          const stored = await AsyncStorage.getItem(HISTORY_KEY);
          let history = stored ? JSON.parse(stored) : [];
          // Add to beginning of array
          history = [historyItem, ...history];
          await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (err) {
          console.error('Error saving to history:', err);
        }

        // Navigate to Response screen
        navigation.navigate('Response', {
          query: query,
          verses: result.verses_referenced,
          response: result.guidance,
          timestamp: historyItem.timestamp,
        });
      } else {
        Alert.alert('Error', 'Failed to get guidance. Please try again.');
      }
    } catch (err: any) {
      console.error('Error fetching guidance:', err);
      Alert.alert('Error', err.message || 'Failed to get guidance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Scripture Selector */}
            <View style={styles.scriptureSelector}>
              <Text style={styles.selectorLabel}>Choose Your Wisdom Source</Text>

              {/* Custom Dropdown Trigger */}
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownValue}>{getSelectedLabel()}</Text>
                <Ionicons
                  name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.primary[600]}
                />
              </TouchableOpacity>

              {/* Dropdown Options (Rendered conditionally) */}
              {isDropdownOpen && (
                <View style={styles.dropdownOptions}>
                  {scriptures.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.dropdownOption,
                        selectedScripture === item.value && styles.dropdownOptionSelected
                      ]}
                      onPress={() => handleSelectScripture(item.value)}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        selectedScripture === item.value && styles.dropdownOptionTextSelected
                      ]}>
                        {item.label}
                      </Text>
                      {selectedScripture === item.value && (
                        <Ionicons name="checkmark" size={20} color={colors.primary[600]} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Conditional Content */}
            {selectedScripture === 'gita' ? (
              <GuidanceForm onSubmit={handleSubmit} isLoading={loading} />
            ) : (
              /* Coming Soon Message for Bible/Quran/Torah */
              <View style={styles.comingSoonContainer}>
                <Ionicons name="hourglass-outline" size={64} color={colors.gray[300]} />
                <Text style={styles.comingSoonTitle}>
                  {getScriptureName(selectedScripture)} Coming Soon
                </Text>
                <Text style={styles.comingSoonText}>
                  We're working on bringing wisdom from the {getScriptureName(selectedScripture)} to Sarthi.

                </Text>

              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50], // Warm off-white
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.xl,
    flexGrow: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  scriptureSelector: {
    width: '90%',
    marginBottom: 24,
    zIndex: 10, // Ensure dropdown appears above
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 14,
    // Modern subtle shadow
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownValue: {
    fontSize: 16,
    color: colors.gray[800],
    fontWeight: '500',
  },
  dropdownOptions: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  dropdownOptionSelected: {
    backgroundColor: colors.primary[50],
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  dropdownOptionTextSelected: {
    color: colors.primary[800],
    fontWeight: '600',
  },
  comingSoonContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 24,
  },

  welcomeSection: {
    width: '90%',
    marginTop: spacing.xxl,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  welcomeEmoji: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  welcomeText: {
    fontSize: 15,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  footerInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    width: '100%',
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.gray[400],
    textAlign: 'center',
  },
  highlightText: {
    color: colors.primary[700],
    fontWeight: '600',
  },
  omContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    opacity: 0.05, // Very subtle
  },
  omSymbol: {
    fontSize: 100,
    color: colors.gray[400], // Neutral gray instead of gold
  },
});
