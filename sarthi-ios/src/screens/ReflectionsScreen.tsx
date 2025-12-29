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
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { spacing } from '../theme/spacing';
import { colors } from '../theme/colors';
import { Trash2, Plus, X, MessageSquare, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { reflectionService, Reflection } from '../services/reflectionService';

export default function ReflectionsScreen({ navigation }: any) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reflection_text: '',
    verse_id: '',
    chapter_id: '',
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchReflections();
    }
  }, [isFocused]);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      const data = await reflectionService.getReflections();
      setReflections(Array.isArray(data) ? data : []);
    } catch (error) {
      //console.error('Error fetching reflections:', error);
      // Fallback to empty if server fails or not implemented
      setReflections([]);
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
      await reflectionService.createReflection({
        reflection_text: formData.reflection_text,
        verse_id: formData.verse_id || undefined,
        chapter_id: formData.chapter_id || undefined,
      });
      setFormData({ reflection_text: '', verse_id: '', chapter_id: '' });
      setShowForm(false);
      fetchReflections();
    } catch (error) {
      console.error('Error creating reflection:', error);
      Alert.alert('Error', 'Failed to save reflection');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
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
              await reflectionService.deleteReflection(id);
              fetchReflections();
            } catch (error) {
              console.error('Error deleting reflection:', error);
              Alert.alert('Error', 'Failed to delete reflection');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Reflection }) => {
    if (!item) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.reflectionText}>{item.reflection_text || ''}</Text>
            <TouchableOpacity onPress={() => item.id && handleDelete(item.id)} style={styles.deleteButton}>
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardFooter}>
            {item.verse_id ? (
              <View style={styles.tag}>
                <BookOpen size={12} color={colors.spiritual.blue.DEFAULT} style={{ marginRight: 4 }} />
                <Text style={styles.tagText}>Verse {item.verse_id}</Text>
              </View>
            ) : item.chapter_id ? (
              <View style={styles.tag}>
                <BookOpen size={12} color={colors.spiritual.blue.DEFAULT} style={{ marginRight: 4 }} />
                <Text style={styles.tagText}>Chapter {item.chapter_id}</Text>
              </View>
            ) : <View />}

            <Text style={styles.dateText}>
              {(() => {
                try {
                  return item.created_at ? new Date(item.created_at).toLocaleDateString() : '';
                } catch (e) {
                  return '';
                }
              })()}
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
      <LinearGradient
        colors={['#dbeafe', '#fef3c7']}
        style={styles.background}
      >
        <View style={styles.safeArea}>
          <View style={styles.headerRow}>
            <Text style={styles.headerSubtitle}>Reflect on the teachings of the Gita</Text>
            <TouchableOpacity
              onPress={() => setShowForm(!showForm)}
              style={[styles.addButton, showForm && styles.cancelButton]}
            >
              {showForm ? <X size={20} color="#fff" /> : <Plus size={20} color="#fff" />}
              <Text style={styles.addButtonText}>{showForm ? 'Cancel' : 'Add'}</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>New Reflection</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                value={formData.reflection_text}
                onChangeText={(text) => setFormData({ ...formData, reflection_text: text })}
                placeholder="Share your thoughts and reflections..."
                placeholderTextColor={colors.gray[400]}
              />
              <View style={styles.formInputs}>
                <TextInput
                  style={styles.smallInput}
                  value={formData.verse_id}
                  onChangeText={(text) => setFormData({ ...formData, verse_id: text, chapter_id: '' })}
                  placeholder="Verse ID"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.smallInput}
                  value={formData.chapter_id}
                  onChangeText={(text) => setFormData({ ...formData, chapter_id: text, verse_id: '' })}
                  placeholder="Chapter ID"
                  placeholderTextColor={colors.gray[400]}
                  keyboardType="numeric"
                  editable={formData.verse_id === ''}
                />
              </View>
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
                  <ActivityIndicator color={colors.spiritual.blue.DEFAULT} size="large" />
                </View>
              )
            }
          />

          {/* Floating Om Symbol */}
          <View style={styles.omContainer} pointerEvents="none">
            <Text style={styles.omSymbol}>ॐ</Text>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

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
    backgroundColor: colors.spiritual.blue.DEFAULT,
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
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: spacing.md,
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
    backgroundColor: colors.spiritual.blue.DEFAULT,
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.spiritual.blue.DEFAULT,
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
    color: colors.spiritual.gold.DEFAULT,
  },
});
