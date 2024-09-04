import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ícones da Expo

const SignupScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Controle para mostrar/ocultar senha
    const [error, setError] = useState('');

    const navigation = useNavigation();

    const validateEmail = (email) => {
        return (
            email.endsWith('@estudante.sesisenai.org.br') ||
            email.endsWith('@gmail.com')
        );
    };

    const handleSignup = async () => {
        if (!validateEmail(email)) {
            setError('Email must end with @estudante.sesisenai.org.br or @gmail.com');
            return;
        }

        setError('');

        try {
            const response = await fetch('https://taskhub-s37f.onrender.com/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Signup Successful', `Welcome, ${data.name}!`);
                navigation.navigate('HomeScreen'); 
            } else {
                if (data.message && data.message.includes('E-mail já existe')) {
                    setError('E-mail já existe. Por favor, use outro e-mail.');
                } else {
                    setError(data.message || 'Signup Failed. Please try again.');
                }
            }
        } catch (error) {
            setError('Error: Unable to sign up. Please try again later.');
        }
    };

    return (
        <LinearGradient
            colors={['#f5f5f5', '#e0e0e0']} 
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor="#888" 
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Your Email"
                    placeholderTextColor="#888" 
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, styles.passwordInput]}
                        placeholder="Create Password"
                        placeholderTextColor="#888"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                        style={styles.showPasswordButton} 
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons 
                            name={showPassword ? 'eye-off' : 'eye'} 
                            size={24} 
                            color="#888" 
                        />
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5, 
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#F7F7F7',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333333',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    passwordInput: {
        paddingRight: 50,
    },
    showPasswordButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        height: 50,
        justifyContent: 'center',
    },
    errorText: {
        color: '#FF6666',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#333333',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
