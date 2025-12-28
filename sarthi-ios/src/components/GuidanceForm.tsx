import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Send, Sparkles } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';

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
                    <Sparkles size={24} color={colors.spiritual.gold.DEFAULT} />
                    <Text style={styles.title}>AI Spiritual Guidance</Text>
                    <Sparkles size={24} color={colors.spiritual.blue.DEFAULT} />
                </View>
                <Text style={styles.subtitle}>
                    Seek wisdom from the Bhagavad Gita with AI-powered guidance
                </Text>
            </View>

            {/* Main Form */}
            <View style={styles.formCard}>
                <Text style={styles.label}>What guidance do you seek?</Text>
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
                >
                    <LinearGradient
                        colors={[colors.spiritual.blue.DEFAULT, colors.spiritual.gold.DEFAULT]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.button, (isLoading || !query.trim()) && styles.buttonDisabled]}
                    >
                        {isLoading ? (
                            <Text style={styles.buttonText}>Seeking Wisdom...</Text>
                        ) : (
                            <View style={styles.buttonContent}>
                                <Send size={20} color={colors.white} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Seek Guidance</Text>
                            </View>
                        )}
                    </LinearGradient>
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
        fontSize: 28,
        fontWeight: '800',
        color: colors.spiritual.blue.DEFAULT,
        marginHorizontal: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray[600],
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.gray[100],
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
        borderRadius: 12,
        padding: spacing.md,
        fontSize: 16,
        color: colors.gray[800],
        minHeight: 120,
        textAlignVertical: 'top',
        marginBottom: spacing.lg,
        backgroundColor: colors.gray[50],
    },
    button: {
        borderRadius: 12,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
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
        fontSize: 18,
        fontWeight: '700',
    },
    samplesContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    samplesLabel: {
        fontSize: 14,
        color: colors.gray[600],
        marginBottom: spacing.sm,
    },
    samplesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    sampleButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.spiritual.blue.light + '40',
        borderRadius: 20,
    },
    sampleButtonText: {
        fontSize: 13,
        color: colors.spiritual.blue.DEFAULT,
        fontWeight: '500',
    },
});

export default GuidanceForm;
