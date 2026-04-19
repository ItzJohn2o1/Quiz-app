import { ButtonGroup } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const quizData = [
  {
    prompt: 'The Earth is the third planet from the Sun.',
    type: 'true-false',
    choices: ['True', 'False'],
    //correct: 0,
  },
  {
    prompt: 'Which one is a JavaScript framework?',
    type: 'multiple-choice',
    choices: ['React', 'Banana', 'Car', 'Table'],
    //correct: 0,
  },
  {
    prompt: 'Which of these are programming languages?',
    type: 'multiple-answer',
    choices: ['Python', 'HTML', 'Java', 'CSS'],
    //correct: [0, 2],
  },
];

export default function Index() {
  const params = useLocalSearchParams();
  const questionIndex = Number(params.questionIndex ?? 0);

  const parsedAnswers = useMemo(() => {
    if (!params.userAnswers) return [];
    try {
      return JSON.parse(params.userAnswers as string);
    } catch {
      return [];
    }
  }, [params.userAnswers]);

  const currentQuestion = quizData[questionIndex];

  const [selectedIndex, setSelectedIndex] = useState<number | number[]>(
    currentQuestion?.type === 'multiple-answer'
      ? parsedAnswers[questionIndex] ?? []
      : parsedAnswers[questionIndex] ?? null
  );

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>No question available.</Text>
      </View>
    );
  }

  const toggleMultipleAnswer = (index: number) => {
    if (!Array.isArray(selectedIndex)) return;

    if (selectedIndex.includes(index)) {
      setSelectedIndex(selectedIndex.filter((item) => item !== index));
    } else {
      setSelectedIndex([...selectedIndex, index]);
    }
  };

  const handleChoicePress = (index: number) => {
    if (currentQuestion.type === 'multiple-answer') {
      toggleMultipleAnswer(index);
    } else {
      setSelectedIndex(index);
    }
  };

  const handleNext = () => {
    const updatedAnswers = [...parsedAnswers];
    updatedAnswers[questionIndex] = selectedIndex;

    if (questionIndex < quizData.length - 1) {
      router.push({
        pathname: '/',
        params: {
          questionIndex: String(questionIndex + 1),
          userAnswers: JSON.stringify(updatedAnswers),
        },
      });
    } else {
      router.push({
        pathname: '/Summary',
        params: {
          userAnswers: JSON.stringify(updatedAnswers),
        },
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.counter}>
        Question {questionIndex + 1} of {quizData.length}
      </Text>

      <Text style={styles.prompt}>{currentQuestion.prompt}</Text>

      <View testID="choices">
        <ButtonGroup
          buttons={currentQuestion.choices}
          vertical
          onPress={handleChoicePress}
          selectedIndexes={
            currentQuestion.type === 'multiple-answer' && Array.isArray(selectedIndex)
              ? selectedIndex
              : undefined
          }
          selectedIndex={
            currentQuestion.type !== 'multiple-answer' && typeof selectedIndex === 'number'
              ? selectedIndex
              : undefined
          }
        />
      </View>

      <Pressable style={styles.button} onPress={handleNext} testID="next-question">
        <Text style={styles.buttonText}>
          {questionIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  counter: {
    fontSize: 16,
    marginBottom: 12,
    color: '#666',
  },
  prompt: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#1f6feb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});