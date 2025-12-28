import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Plus, Trash2, X } from 'lucide-react-native';
import { reflectionService, Reflection } from '../services/reflectionService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function ReflectionsScreen() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reflection_text: '',
    verse_id: '',
    chapter_id: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    try {
      const data = await reflectionService.getReflections();
      setReflections(data);
    } catch (error) {
      console.error('Error fetching reflections:', error);
      Alert.alert('Error', 'Failed to load reflections');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.reflection_text.trim()) {
      Alert.alert('Error', 'Please enter a reflection');
      return;
    }

    setSubmitting(true);
    try {
      await reflectionService.createReflection({
        reflection_text: formData.reflection_text.trim(),
        verse_id: formData.verse_id || undefined,
        chapter_id: formData.chapter_id || undefined,
      });
      setFormData({ reflection_text: '', verse_id: '', chapter_id: '' });
      setShowForm(false);
      fetchReflections();
    } catch (error) {
      console.error('Error creating reflection:', error);
      Alert.alert('Error', 'Failed to create reflection');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Reflection',
      'Are you sure you want to delete this reflection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await reflectionService.deleteReflection(id);
              fetchReflections();
            } catch (error) {
              console.error('Error deleting reflection:', error);
              Alert.alert('Error', 'Failed to delete reflection');
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading reflections...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Reflections</Text>
        <TouchableOpacity
          onPress={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? <X size={20} color={colors.white} /> : <Plus size={20} color={colors.white} />}
          <Text style={styles.addButtonText}>{showForm ? 'Cancel' : 'Add Reflection'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Add Reflection Form */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Reflection</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Reflection</Text>
              <TextInput
                style={styles.textArea}
                value={formData.reflection_text}
                onChangeText={(text) => setFormData({ ...formData, reflection_text: text })}
                placeholder="Share your thoughts and reflections..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Verse ID (optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.verse_id}
                  onChangeText={(text) => setFormData({ ...formData, verse_id: text, chapter_id: '' })}
                  placeholder="e.g., 123"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formGroup, styles.flex1, { marginLeft: spacing.md }]}>
                <Text style={styles.label}>Chapter ID (if no verse)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.chapter_id}
                  onChangeText={(text) => setFormData({ ...formData, chapter_id: text, verse_id: '' })}
                  placeholder="e.g., 1"
                  keyboardType="numeric"
                  editable={!formData.verse_id}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              style={[styles.submitButton, submitting && styles.disabledButton]}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Save Reflection</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Reflections List */}
        {reflections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reflections yet. Add your first reflection!</Text>
          </View>
        ) : (
          reflections.map((reflection) => (
            <View key={reflection.id} style={styles.reflectionCard}>
              <View style={styles.cardHeader}>
                <View style={styles.flex1}>
                  <Text style={styles.reflectionText}>{reflection.reflection_text}</Text>
                  {reflection.verse_id ? (
                    <Text style={styles.reflectionMeta}>
                      <Text style={styles.bold}>Verse:</Text> {reflection.verse_id}
                    </Text>
                  ) : reflection.chapter_id ? (
                    <Text style={styles.reflectionMeta}>
                      <Text style={styles.bold}>Chapter:</Text> {reflection.chapter_id}
                    </Text>
                  ) : null}
                  <Text style={styles.timestamp}>
                    {new Date(reflection.created_at).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(reflection.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.gray[500],
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray[900],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.gray[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.gray[900],
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray[500],
    fontSize: 16,
  },
  reflectionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
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
    marginBottom: spacing.sm,
  },
  reflectionMeta: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 2,
  },
  bold: {
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: spacing.xs,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});
