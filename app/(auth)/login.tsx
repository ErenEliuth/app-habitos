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
  };

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !username)) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }
    
    setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error al iniciar sesión', error.message);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (error) {
        Alert.alert('Error al registrarse', error.message);
      } else {
        if (data.session) {
          Alert.alert('¡Éxito!', 'Cuenta creada e inicio de sesión automático.');
          router.replace('/(tabs)');
        } else {
          Alert.alert(
            'Registro completado', 
            'Se ha enviado un correo de confirmación. Por favor revísalo para activar tu cuenta.'
          );
          setMode('login'); // Regresar a login para que intenten entrar después
        }
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Sanctuary</Text>
        <Text style={[styles.subtitle, { color: colors.textAlt }]}>
          {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratuita'}
        </Text>

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
});
