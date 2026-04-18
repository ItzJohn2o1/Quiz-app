import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

const quizData = [
    {
        prompt: 'This is the question...',
        type: 'multiple-choice',
        choices: ['choice 1', 'choice 2', 'choice 3', 'choice 4'],
        correct: 0,
    },
    {
        prompt: 'This is another question...',
        type: 'multiple-answer',
        choices: ['choice 1', 'choice 2', 'choice 3', 'choice 4'],
        correct: [0, 2],
    },
    {
        prompt: 'This is the third question...',
        type: 'true-false',
        choices: ['True', 'False'],
        correct: 1,
    },
];

export function Question({ route, navigation }) {
    return (
        <View>
            <Text>Question screen</Text>
        </View>
    );
}

export function Summary({ route }) {
    return (
        <View>
            <Text testID="total">0</Text>
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Question">
                <Stack.Screen
                    name="Question"
                    component={Question}
                    initialParams={{
                        data: quizData,
                        questionIndex: 0,
                        userAnswers: [],
                    }}
                    options={{ headerBackVisible: false }}
                />
                <Stack.Screen
                    name="Summary"
                    component={Summary}
                    options={{ headerBackVisible: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}