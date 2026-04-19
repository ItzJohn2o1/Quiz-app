import { ButtonGroup } from '@rneui/themed';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function Question({ route, navigation }) {
    const { data, questionIndex, userAnswers } = route.params;
    const currentQuestion = data[questionIndex];
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleNext = () => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[questionIndex] = selectedIndex;

        if (questionIndex < data.length - 1) {
            navigation.push('Question', {
                data,
                questionIndex: questionIndex + 1,
                userAnswers: updatedAnswers,
            });
        } else {
            navigation.navigate('Summary', {
                data,
                userAnswers: updatedAnswers,
            });
        }
    };

    return (
        <View>
            <Text>{currentQuestion.prompt}</Text>

            <ButtonGroup
                testID="choices"
                buttons={currentQuestion.choices}
                selectedIndex={selectedIndex}
                onPress={setSelectedIndex}
            />

            <Button
                title="Next Question"
                testID="next-question"
                onPress={handleNext}
            />
        </View>
    );
}