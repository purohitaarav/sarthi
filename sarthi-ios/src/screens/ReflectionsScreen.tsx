import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  InputAccessoryView,
  Button,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import ResponseDisplay from '../components/ResponseDisplay';
import { spacing } from '../theme/spacing';
import { colors } from '../theme/colors';
import { Trash2, Plus, X, MessageSquare, BookOpen, Quote, ChevronRight } from 'lucide-react-native';

const REFLECTIONS_STORAGE_KEY = '@sarthi_reflections';

// Extended reflection type for local storage
interface LocalReflection {
  id: string; // uuid or number
  reflection_text: string;
  verse_id?: string;
  chapter_id?: string;
  created_at: string;
  query?: string;
  response_data?: {
    guidance: string;
    verses: any[];
    timestamp: string;
  };
}

type ReflectionsScreenRouteProp = RouteProp<RootStackParamList, 'Reflections'>;

interface Props {
  navigation: any;
  route: ReflectionsScreenRouteProp;
}

export default function ReflectionsScreen({ navigation, route }: Props) {
  const [reflections, setReflections] = useState<LocalReflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reflection_text: '',
  });
  const [contextData, setContextData] = useState<{ query: string; timestamp: string; response?: string; verses?: any[] } | null>(null);

  // Context Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [previewData, setPreviewData] = useState<{ query: string; response: string; verses: any[]; timestamp: string } | null>(null);

  const isFocused = useIsFocused();

  const handleOpenContext = (data: { query: string; response?: string; verses?: any[]; timestamp: string }) => {
    if (data.query && data.response) {
      setPreviewData({
        query: data.query,
        response: data.response,
        verses: data.verses || [],
        timestamp: data.timestamp
      });
      setModalVisible(true);
    }
  };

  useEffect(() => {
    if (route.params?.query) {
      if (route.params.initialReflection !== undefined) {
        setFormData(prev => ({ ...prev, reflection_text: route.params.initialReflection || '' }));
      }
      setContextData({
        query: route.params.query,
        timestamp: route.params.timestamp || new Date().toISOString(),
        response: route.params.response,
        verses: route.params.verses,
      });
      setShowForm(true);
    }
  }, [route.params]);

  useEffect(() => {
    if (isFocused) {
      fetchReflections();
    }
  }, [isFocused]);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(REFLECTIONS_STORAGE_KEY);
      if (stored) {
        setReflections(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.reflection_text.trim()) {
      Alert.alert('Error', 'Please enter your reflection text');
      return;
    }

    setSubmitting(true);
    try {
      const newReflection: LocalReflection = {
        id: Date.now().toString(),
        reflection_text: formData.reflection_text,
        created_at: new Date().toISOString(),
        query: contextData?.query,
        response_data: contextData?.response ? {
          guidance: contextData.response,
          verses: contextData.verses || [],
          timestamp: contextData.timestamp
        } : undefined
      };

      const updatedReflections = [newReflection, ...reflections];
      await AsyncStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(updatedReflections));
      setReflections(updatedReflections);

      setFormData({ reflection_text: '' });
      setContextData(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating reflection:', error);
      Alert.alert('Error', 'Failed to save reflection');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Reflection",
      "Are you sure you want to delete this reflection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedReflections = reflections.filter(r => r.id !== id);
              await AsyncStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(updatedReflections));
              setReflections(updatedReflections);
            } catch (error) {
              console.error('Error deleting reflection:', error);
              Alert.alert('Error', 'Failed to delete reflection');
            }
          }
        }
      ]
    );
  };

  const navigateToResponse = (refl: LocalReflection) => {
    if (refl.query && refl.response_data) {
      navigation.navigate('HomeMain', {
        screen: 'Response',
        params: {
          query: refl.query,
          response: refl.response_data.guidance,
          verses: refl.response_data.verses,
          timestamp: refl.response_data.timestamp,
        }
      });
    }
  };

  const renderItem = ({ item }: { item: LocalReflection }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {item.query && (
            <TouchableOpacity
              style={styles.savedContextContainer}
              onPress={() => item.response_data && handleOpenContext({
                query: item.query!,
                response: item.response_data.guidance,
                verses: item.response_data.verses,
                timestamp: item.response_data.timestamp
              })}
              disabled={!item.response_data}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Quote size={12} color={colors.primary[600]} style={{ marginRight: 6 }} />
                <Text style={styles.savedContextLabel}>Re: {item.query}</Text>
              </View>
              {item.response_data && <ChevronRight size={14} color={colors.gray[400]} style={{ position: 'absolute', right: 8, top: 8 }} />}
            </TouchableOpacity>
          )}

          <View style={styles.cardHeader}>
            <Text style={styles.reflectionText}>{item.reflection_text}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardFooter}>
            {item.verse_id ? (
              <View style={styles.tag}>
                <BookOpen size={12} color={colors.primary[600]} style={{ marginRight: 4 }} />
                <Text style={styles.tagText}>Verse {item.verse_id}</Text>
              </View>
            ) : item.chapter_id ? (
              <View style={styles.tag}>
                <BookOpen size={12} color={colors.primary[600]} style={{ marginRight: 4 }} />
                <Text style={styles.tagText}>Chapter {item.chapter_id}</Text>
              </View>
            ) : <View />}

            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Text style={styles.headerSubtitle}>Reflect on the teachings of the Gita</Text>
          <TouchableOpacity
            onPress={() => {
              setShowForm(!showForm);
              if (!showForm) setContextData(null); // Clear context if manually opening
            }}
            style={[styles.addButton, showForm && styles.cancelButton]}
          >
            {showForm ? <X size={20} color="#fff" /> : <Plus size={20} color="#fff" />}
            <Text style={styles.addButtonText}>{showForm ? 'Cancel' : 'Add'}</Text>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Reflection</Text>

            {contextData && (
              <TouchableOpacity
                style={styles.contextContainer}
                onPress={() => handleOpenContext(contextData)}
                disabled={!contextData.response}
              >
                <View style={styles.contextHeader}>
                  <Quote size={14} color={colors.primary[600]} style={{ marginRight: 6 }} />
                  <Text style={styles.contextLabel}>Reflecting on Query:</Text>
                  {contextData.response && (
                    <ChevronRight size={14} color={colors.gray[400]} style={{ marginLeft: 'auto' }} />
                  )}
                </View>
                <Text style={styles.contextText}>{contextData.query}</Text>
                <Text style={styles.contextDate}>{new Date(contextData.timestamp).toLocaleDateString()}</Text>
              </TouchableOpacity>
            )}

            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              value={formData.reflection_text}
              onChangeText={(text) => setFormData({ ...formData, reflection_text: text })}
              placeholder="Share your thoughts and reflections..."
              placeholderTextColor={colors.gray[400]}
              inputAccessoryViewID="reflectionDone"
            />
            {Platform.OS === 'ios' && (
              <InputAccessoryView nativeID="reflectionDone">
                <View style={styles.accessory}>
                  <Button onPress={() => Keyboard.dismiss()} title="Done" color={colors.primary[600]} />
                </View>
              </InputAccessoryView>
            )}

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Save Reflection</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={reflections}
          renderItem={renderItem}
          keyExtractor={item => item?.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <MessageSquare size={48} color={colors.gray[300]} />
                </View>
                <Text style={styles.emptyTitle}>No reflections yet</Text>
                <Text style={styles.emptySubtitle}>
                  Write down your personal insights and realisations from the Gita.
                </Text>
              </View>
            ) : (
              <View style={styles.centered}>
                <ActivityIndicator color={colors.primary[600]} size="large" />
              </View>
            )
          }
        />

        {/* Context Preview Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.fullScreenModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Original Response</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                <X size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {previewData && (
                <ResponseDisplay
                  response={{
                    query: previewData.query,
                    guidance: previewData.response,
                    verses_referenced: previewData.verses,
                    timestamp: previewData.timestamp
                  }}
                  hideReflectButton={true}
                />
              )}
            </ScrollView>

            {/* Floating Om Symbol */}
            <View style={styles.omContainer} pointerEvents="none">
              <Text style={styles.omSymbol}>ॐ</Text>
            </View>
          </View>
        </Modal>
        <View style={styles.omContainer} pointerEvents="none">
          <Text style={styles.omSymbol}>ॐ</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600], // Primary Green
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: colors.gray[500],
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 4,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  savedContextContainer: {
    backgroundColor: colors.primary[50], // Very light green
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[300],
  },
  savedContextLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[800],
    fontStyle: 'italic',
  },
  contextContainer: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contextLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[700],
    textTransform: 'uppercase',
  },
  contextText: {
    fontSize: 14,
    color: colors.gray[800],
    fontStyle: 'italic',
    marginBottom: 4,
  },
  contextDate: {
    fontSize: 11,
    color: colors.gray[500],
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.gray[800],
    backgroundColor: colors.gray[50],
    marginBottom: spacing.md,
    textAlignVertical: 'top',
    height: 100,
  },
  formInputs: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  smallInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 14,
    color: colors.gray[800],
    backgroundColor: colors.gray[50],
  },
  submitButton: {
    backgroundColor: colors.primary[600], // Primary Green
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reflectionText: {
    fontSize: 16,
    color: colors.gray[800],
    lineHeight: 24,
    flex: 1,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50], // Mint Green
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary[700], // Green text
  },
  dateText: {
    fontSize: 12,
    color: colors.gray[400],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: spacing.xxl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(229, 231, 235, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
  },
  centered: {
    paddingTop: 100,
    alignItems: 'center',
  },
  omContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    opacity: 0.05,
  },
  omSymbol: {
    fontSize: 100,
    color: colors.gray[400],
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  accessory: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: colors.gray[50], // Match gray to be seamless
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
  },
  closeModalButton: {
    padding: 4,
  },
});
