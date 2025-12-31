import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const { width } = Dimensions.get('window');

interface GuidanceFormProps {
    onSubmit: (query: string) => void;
    isLoading: boolean;
}

const GuidanceForm: React.FC<GuidanceFormProps> = ({ onSubmit, isLoading }) => {
    const [query, setQuery] = useState('');

    const sampleQueries = [
        "How can I find inner peace?",
        "What is my dharma?",
        "How to deal with anxiety?",
        "How to overcome fear?",
        "What does the Gita say about karma?"
    ];

    const handleSubmit = () => {
        if (query.trim() && !isLoading) {
            onSubmit(query.trim());
        }
    };

    const handleSampleClick = (sample: string) => {
        setQuery(sample);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Spiritual Guidance</Text>
                </View>
                <Text style={styles.subtitle}>
                    Seek timeless wisdom from the scriptures!
                </Text>
            </View>

            {/* Main Form */}
            <View style={styles.formCard}>
                <Text style={styles.label}>Explain your question or difficulty</Text>
                <TextInput
                    style={styles.input}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Ask your question here..."
                    placeholderTextColor={colors.gray[400]}
                    multiline
                    numberOfLines={4}
                    editable={!isLoading}
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading || !query.trim()}
                    activeOpacity={0.8}
                    style={[styles.button, (isLoading || !query.trim()) && styles.buttonDisabled]}
                >
                    {isLoading ? (
                        <View style={styles.buttonContent}>
                            <ActivityIndicator color={colors.white} style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Seeking Wisdom...</Text>
                        </View>
                    ) : (
                        <View style={styles.buttonContent}>
                            <Send size={20} color={colors.white} style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Seek Guidance</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Sample Queries */}
            <View style={styles.samplesContainer}>
                <Text style={styles.samplesLabel}>Try asking:</Text>
                <View style={styles.samplesList}>
                    {sampleQueries.map((sample, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSampleClick(sample)}
                            disabled={isLoading}
                            style={styles.sampleButton}
                        >
                            <Text style={styles.sampleButtonText}>{sample}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: spacing.md,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.gray[800], // Dark gray title
        marginHorizontal: spacing.sm,
        textAlign: 'center',
        letterSpacing: -0.5, // Modern tight tracking
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray[500],
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05, // Subtle shadow (Notion-like)
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.gray[200],
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.gray[700],
        marginBottom: spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 8, // Slightly more squared
        padding: spacing.md,
        fontSize: 16,
        color: colors.gray[800],
        minHeight: 120,
        textAlignVertical: 'top',
        marginBottom: spacing.lg,
        backgroundColor: colors.gray[50], // Very light bg
    },
    button: {
        backgroundColor: colors.primary[600], // Slightly brighter Green
        borderRadius: 12,
        paddingVertical: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.8,
        backgroundColor: colors.primary[200], // Faded green instead of gray
        shadowOpacity: 0,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonIcon: {
        marginRight: spacing.sm,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    samplesContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    samplesLabel: {
        fontSize: 14,
        color: colors.gray[500],
        marginBottom: spacing.sm,
    },
    samplesList: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
    sampleButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.primary[50], // Minty green background
        borderWidth: 1,
        borderColor: colors.primary[200], // Soft green border
        borderRadius: 20,
    },
    sampleButtonText: {
        fontSize: 13,
        color: colors.primary[700], // Green text
        fontWeight: '600',
    },
});

export default GuidanceForm;
