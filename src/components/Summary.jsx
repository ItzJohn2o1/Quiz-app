import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Summary({ route }) {
    const { data, userAnswers } = route.params;

    const getCorrectIndices = (question) => {
        return Array.isArray(question.correct) ? question.correct : [question.correct];
    };

    const getSelectedIndices = (answer) => {
        return Array.isArray(answer) ? answer : [answer];
    };

    const isQuestionCorrect = (question, answer) => {
        const correct = getCorrectIndices(question).slice().sort().join(',');
        const selected = getSelectedIndices(answer).slice().sort().join(',');
        return correct === selected;
    };

    const score = data.reduce((total, question, index) => {
        return total + (isQuestionCorrect(question, userAnswers[index]) ? 1 : 0);
    }, 0);

    const formatChoice = (question, answer) => {
        if (answer == null) return 'No answer';
        const selected = getSelectedIndices(answer);
        return selected.map((i) => question.choices[i]).join(', ');
    };

    const formatCorrect = (question) => {
        return getCorrectIndices(question).map((i) => question.choices[i]).join(', ');
    };

    return (
        <ScrollView style={styles.container}>
            <Text testID="total" style={styles.total}>
                {score}
            </Text>

            {data.map((question, index) => {
                const correct = isQuestionCorrect(question, userAnswers[index]);
                const userAnswer = userAnswers[index];

                return (
                    <View key={index} style={styles.card}>
                        <Text style={styles.prompt}>{question.prompt}</Text>

                        <Text
                            style={[
                                styles.answer,
                                !correct && userAnswer != null && styles.strike,
                                correct && styles.bold,
                            ]}
                        >
                            Your answer: {formatChoice(question, userAnswer)}
                        </Text>

                        {!correct && (
                            <Text style={styles.correctAnswer}>
                                Correct answer: {formatCorrect(question)}
                            </Text>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    total: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        marginBottom: 18,
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
    prompt: {
        fontSize: 18,
        marginBottom: 8,
    },
    answer: {
        fontSize: 16,
        marginBottom: 4,
    },
    bold: {
        fontWeight: 'bold',
    },
    strike: {
        textDecorationLine: 'line-through',
    },
    correctAnswer: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});