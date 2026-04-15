import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  
  const colors = {
    background: isDark ? '#121212' : '#f5f5f5',
    card: isDark ? '#1E1E1E' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
    textAlt: isDark ? '#aaaaaa' : '#555555',
    input: isDark ? '#2A2A2A' : '#f0f0f0',
    primary: '#10B981', // A modern green
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error al iniciar sesión', error.message);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error al registrarse', error.message);
    } else {
      Alert.alert('Registro exitoso', 'Revisa tu correo para verificar tu cuenta (si tienes habilitada la confirmación) o inicia sesión.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Sanctuary</Text>
        <Text style={[styles.subtitle, { color: colors.textAlt }]}>Guarda tu progreso en la nube</Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Correo electrónico</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={colors.textAlt}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
            placeholder="********"
            placeholderTextColor={colors.textAlt}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]} 
              onPress={handleLogin}
            >
              <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton, { borderColor: colors.primary }]} 
              onPress={handleSignUp}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 15,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    // Primary Button specific styles
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
