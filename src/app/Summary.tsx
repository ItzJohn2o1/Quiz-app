import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type QuizItem = {
    correct: number | number[];
};

type Answer = number | number[] | null;

const quizData: QuizItem[] = [
    { correct: 0 },
    { correct: 0 },
    { correct: [0, 2] },
];

export default function Summary() {
    const params = useLocalSearchParams();

    const answers: Answer[] = useMemo(() => {
        if (!params.userAnswers) return [];
        try {
            return JSON.parse(params.userAnswers as string) as Answer[];
        } catch {
            return [];
        }
    }, [params.userAnswers]);

    const results = answers.map((answer: Answer, index: number) => {
        const correct = quizData[index]?.correct;

        const isCorrect = Array.isArray(correct)
            ? Array.isArray(answer) &&
            correct.length === answer.length &&
            correct.every((v: number) => answer.includes(v))
            : answer === correct;

        return {
            index,
            isCorrect,
            userAnswerText: Array.isArray(answer) ? answer.join(', ') : String(answer),
            correctAnswerText: Array.isArray(correct) ? correct.join(', ') : String(correct),
        };
    });

    const total = results.reduce((score: number, item: { isCorrect: boolean }) => {
        return item.isCorrect ? score + 1 : score;
    }, 0);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerCard}>
                <Text style={styles.title}>Quiz Summary</Text>
                <Text testID="total" style={styles.score}>
                    Score: {total} / {quizData.length}
                </Text>
            </View>

            {results.map((item: { index: number; isCorrect: boolean; userAnswerText: string; correctAnswerText: string }) => (
                <View key={item.index} style={styles.card}>
                    <Text style={styles.questionLabel}>Question {item.index + 1}</Text>
                    <Text style={item.isCorrect ? styles.correct : styles.incorrect}>
                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </Text>
                    <Text style={styles.detail}>Your answer: {item.userAnswerText}</Text>
                    <Text style={styles.detail}>Correct answer: {item.correctAnswerText}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f3f4f6',
    },
    headerCard: {
        backgroundColor: '#1f6feb',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    score: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    questionLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
        color: '#111827',
    },
    correct: {
        color: '#15803d',
        fontWeight: '700',
        marginBottom: 8,
    },
    incorrect: {
        color: '#b91c1c',
        fontWeight: '700',
        marginBottom: 8,
    },
    detail: {
        fontSize: 14,
        color: '#374151',
        marginTop: 2,
    },
});