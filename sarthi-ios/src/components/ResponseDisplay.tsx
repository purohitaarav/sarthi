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
    onReflect?: (query: string, timestamp: string) => void;
    hideReflectButton?: boolean;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, onReflect, hideReflectButton }) => {
    const [expandedVerses, setExpandedVerses] = useState<Record<number, boolean>>({});

    const toggleVerse = (index: number) => {
        setExpandedVerses(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (!response) return null;

    const { query, guidance, verses_referenced, timestamp } = response;

    // Helper to parse **bold** and *italic* text
    const renderFormattedText = (text: string) => {
        if (!text) return null;

        // Split by newlines first to handle bullets
        const lines = text.split('\n');

        return lines.map((line, lineIndex) => {
            // detailed handling for bullet points
            let cleanLine = line;
            let isBullet = false;

            if (cleanLine.trim().startsWith('* ')) {
                cleanLine = cleanLine.trim().substring(2);
                isBullet = true;
            } else if (cleanLine.trim().startsWith('- ')) {
                cleanLine = cleanLine.trim().substring(2);
                isBullet = true;
            }

            // Parse bold segments (**text**)
            const boldParts = cleanLine.split('**');
            const parsedLine = boldParts.map((boldPart, boldIndex) => {
                // Odd indices are bold
                if (boldIndex % 2 === 1) {
                    return (
                        <Text key={`${lineIndex}-bold-${boldIndex}`} style={{ fontWeight: 'bold', color: colors.gray[900] }}>
                            {boldPart}
                        </Text>
                    );
                }

                // Even indices are not bold, check for italics (*text*)
                const italicParts = boldPart.split('*');
                return italicParts.map((italicPart, italicIndex) => {
                    // Odd indices are italic
                    if (italicIndex % 2 === 1) {
                        return (
                            <Text key={`${lineIndex}-italic-${boldIndex}-${italicIndex}`} style={{ fontStyle: 'italic', color: colors.gray[800] }}>
                                {italicPart}
                            </Text>
                        );
                    }
                    // Plain text
                    return (
                        <Text key={`${lineIndex}-text-${boldIndex}-${italicIndex}`}>
                            {italicPart}
                        </Text>
                    );
                });
            });

            return (
                <View key={lineIndex} style={{ flexDirection: 'row', marginBottom: 4 }}>
                    {isBullet && <Text style={{ marginRight: 6, color: colors.gray[800] }}>•</Text>}
                    <Text style={{ flex: 1, color: colors.gray[700], lineHeight: 24 }}>
                        {parsedLine}
                    </Text>
                </View>
            );
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

            {/* Reflection Button */}
            {!hideReflectButton && onReflect && (
                <TouchableOpacity
                    style={styles.reflectButton}
                    onPress={() => onReflect(query, timestamp)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.reflectButtonText}>Reflect on this</Text>
                </TouchableOpacity>
            )}

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
    reflectButton: {
        backgroundColor: colors.primary[600],
        borderRadius: 12, // Matches Seek Guidance
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        shadowColor: colors.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    reflectButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.5,
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
