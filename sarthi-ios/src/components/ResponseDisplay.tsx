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

    return (
        <View style={styles.container}>
            {/* Query */}
            <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(245, 158, 11, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.queryContainer}
            >
                <View style={styles.queryHeader}>
                    <Quote size={20} color={colors.spiritual.blue.DEFAULT} />
                    <View style={styles.queryContent}>
                        <Text style={styles.queryLabel}>Your Question:</Text>
                        <Text style={styles.queryText}>{query}</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Guidance */}
            <View style={styles.guidanceCard}>
                <View style={styles.cardHeader}>
                    <Sparkles size={24} color={colors.spiritual.gold.DEFAULT} />
                    <Text style={styles.cardTitle}>Spiritual Guidance</Text>
                </View>
                <Text style={styles.guidanceText}>{guidance}</Text>
                <View style={styles.footerLine} />
                <Text style={styles.timestampText}>
                    Received: {new Date(timestamp).toLocaleString()}
                </Text>
            </View>

            {/* Verses */}
            {verses_referenced?.length > 0 && (
                <View style={styles.versesSection}>
                    <View style={styles.versesHeader}>
                        <BookOpen size={24} color={colors.spiritual.blue.DEFAULT} />
                        <Text style={styles.versesTitle}>Referenced Verses</Text>
                    </View>

                    <View style={styles.versesList}>
                        {verses_referenced.map((verse, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
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
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
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
        color: colors.gray[600],
        marginBottom: 2,
    },
    queryText: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.gray[800],
    },
    guidanceCard: {
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: spacing.xl,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.gray[100],
        marginBottom: spacing.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.gray[900],
    },
    guidanceText: {
        fontSize: 17,
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
        backgroundColor: 'rgba(237, 233, 254, 0.3)',
        borderRadius: 24,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.1)',
        marginBottom: spacing.xl,
    },
    versesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    versesTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.gray[900],
    },
    versesList: {
        gap: spacing.md,
    },
    verseCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
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
        color: colors.spiritual.blue.DEFAULT,
    },
    verseTranslation: {
        fontSize: 16,
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
        color: colors.gray[700],
        marginBottom: 4,
    },
    purportText: {
        fontSize: 14,
        color: colors.gray[600],
        lineHeight: 20,
    },
});

export default ResponseDisplay;
