import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { BookOpen, Sparkles, Quote, ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';

interface VerseReference {
    reference: string;
    translation: string;
    purport?: string;
}

interface ResponseDisplayProps {
    response: {
        query: string;
        guidance: string;
        verses_referenced: VerseReference[];
        timestamp: string;
    };
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
    const [expandedVerses, setExpandedVerses] = useState<Record<number, boolean>>({});

    const toggleVerse = (index: number) => {
        setExpandedVerses(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (!response) return null;

    const { query, guidance, verses_referenced, timestamp } = response;

    // Helper to parse **bold** text
    const renderFormattedText = (text: string) => {
        if (!text) return null;
        const parts = text.split('**');
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return <Text key={index} style={{ fontWeight: 'bold', color: colors.gray[900] }}>{part}</Text>;
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    return (
        <View style={styles.container}>
            {/* Query */}
            <View style={styles.queryContainer}>
                <View style={styles.queryHeader}>
                    <Quote size={20} color={colors.primary[600]} />
                    <View style={styles.queryContent}>
                        <Text style={styles.queryLabel}>Your Question:</Text>
                        <Text style={styles.queryText}>{query}</Text>
                    </View>
                </View>
            </View>

            {/* Guidance */}
            <View style={styles.guidanceCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Spiritual Guidance</Text>
                </View>
                <Text style={styles.guidanceText}>
                    {renderFormattedText(guidance)}
                </Text>
                <View style={styles.footerLine} />
                <Text style={styles.timestampText}>
                    Received: {new Date(timestamp).toLocaleString()}
                </Text>
            </View>

            {/* Verses */}
            {verses_referenced?.length > 0 && (
                <View style={styles.versesSection}>
                    <View style={styles.versesHeader}>
                        <BookOpen size={24} color={colors.primary[600]} />
                        <Text style={styles.versesTitle}>Referenced Verses</Text>
                    </View>

                    <View style={styles.versesList}>
                        {verses_referenced.map((verse, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0}
                                onPress={() => toggleVerse(index)}
                                style={styles.verseCard}
                            >
                                <View style={styles.verseHeader}>
                                    <Text style={styles.verseReference}>
                                        Bhagavad Gita {verse.reference}
                                    </Text>
                                    {expandedVerses[index] ?
                                        <ChevronUp size={20} color={colors.gray[400]} /> :
                                        <ChevronDown size={20} color={colors.gray[400]} />
                                    }
                                </View>
                                <Text style={styles.verseTranslation}>{verse.translation}</Text>
                                {expandedVerses[index] && verse.purport && (
                                    <View style={styles.purportContainer}>
                                        <Text style={styles.purportLabel}>Purport:</Text>
                                        <Text style={styles.purportText}>{verse.purport}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: spacing.md,
        marginTop: spacing.xl,
    },
    queryContainer: {
        backgroundColor: colors.gray[100],
        borderRadius: 12,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.gray[200],
        marginBottom: spacing.lg,
    },
    queryHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
    },
    queryContent: {
        flex: 1,
    },
    queryLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.gray[500],
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    queryText: {
        fontSize: 16,
        color: colors.gray[800],
        lineHeight: 22,
    },
    guidanceCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.xl,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.gray[200],
        marginBottom: spacing.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.gray[900],
        letterSpacing: -0.5,
    },
    guidanceText: {
        fontSize: 16,
        lineHeight: 26,
        color: colors.gray[700],
    },
    footerLine: {
        height: 1,
        backgroundColor: colors.gray[100],
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
    },
    timestampText: {
        fontSize: 12,
        color: colors.gray[400],
    },
    versesSection: {
        backgroundColor: colors.primary[50], // Mint background
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.primary[100],
        marginBottom: spacing.xl,
    },
    versesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    versesTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.gray[900],
    },
    versesList: {
        gap: spacing.md,
    },
    verseCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: colors.gray[200],
    },
    verseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    verseReference: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary[700], // Green text
    },
    verseTranslation: {
        fontSize: 15,
        color: colors.gray[800],
        lineHeight: 22,
    },
    purportContainer: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
    },
    purportLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.gray[600],
        marginBottom: 4,
    },
    purportText: {
        fontSize: 14,
        color: colors.gray[600],
        lineHeight: 20,
    },
});

export default ResponseDisplay;
