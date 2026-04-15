import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  const isLogin = mode === 'login';
  
  const colors = {
    background: isDark ? '#121212' : '#f5f5f5',
    card: isDark ? '#1E1E1E' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
    textAlt: isDark ? '#aaaaaa' : '#555555',
    input: isDark ? '#2A2A2A' : '#f0f0f0',
    primary: '#10B981', 
    error: '#EF4444',
  };

  const handleAuth = async () => {
    setMessage(null);
    if (!email || !password || (!isLogin && !username)) {
      setMessage({ text: 'Por favor completa todos los campos requeridos', type: 'error' });
      return;
    }
    
    setLoading(true);
    console.log(`Intentando ${isLogin ? 'login' : 'registro'} para:`, email);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Error login:", error.message);
          setMessage({ text: error.message, type: 'error' });
        } else {
          console.log("Login exitoso");
          router.replace('/(tabs)');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username }
          }
        });

        if (error) {
          console.error("Error registro:", error.message);
          setMessage({ text: error.message, type: 'error' });
        } else {
          console.log("Registro completado, data:", data);
          if (data.session) {
            setMessage({ text: '¡Éxito! Iniciando sesión...', type: 'success' });
            setTimeout(() => router.replace('/(tabs)'), 1500);
          } else {
            setMessage({ 
              text: 'Registro completado. Por favor revisa tu correo para activar tu cuenta.', 
              type: 'success' 
            });
            setTimeout(() => setMode('login'), 3000);
          }
        }
      }
    } catch (err: any) {
      console.error("Error inesperado:", err);
      const errorMessage = err.message || 'Error desconocido';
      setMessage({ 
        text: `Error de red: ${errorMessage}. (URL: ${supabaseUrl.substring(0, 15)}...)`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Sanctuary</Text>
        <Text style={[styles.subtitle, { color: colors.textAlt }]}>
          {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratuita'}
        </Text>

        {message && (
          <View style={[
            styles.messageBox, 
            { backgroundColor: message.type === 'error' ? colors.error + '20' : colors.primary + '20' }
          ]}>
            <Text style={[
              styles.messageText, 
              { color: message.type === 'error' ? colors.error : colors.primary }
            ]}>
              {message.text}
            </Text>
          </View>
        )}

        {!isLogin && (
          <>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Nombre de Usuario</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
                placeholder="Nombre completo o alias"
                placeholderTextColor={colors.textAlt}
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </>
        )}

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
              style={[styles.button, { backgroundColor: colors.primary }]} 
              onPress={handleAuth}
            >
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toggleContainer} 
              onPress={() => setMode(isLogin ? 'signup' : 'login')}
            >
              <Text style={[styles.toggleText, { color: colors.textAlt }]}>
                {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
                  {isLogin ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </Text>
              </Text>
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
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
  },
  messageBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
