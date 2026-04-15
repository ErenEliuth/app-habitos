import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';

const colors = {
  background: '#121212',
  card: '#1E1E1E',
  border: '#333333',
  text: '#FFFFFF',
  accent: '#10B981', 
};

export default function HabitsScreen() {
  const [mode, setMode] = useState<'build' | 'quit'>('build');
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<any[]>([]);
  const [logs, setLogs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // 1. Obtener todos los hábitos
      const { data: habitsData, error: hError } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });

      if (hError) throw hError;

      // Si no hay hábitos, crear uno de prueba para que no se vea vacío
      if (habitsData.length === 0) {
        const { data: newHabit } = await supabase
          .from('habits')
          .insert({ title: 'Tomar Agua 💧', color: '#3B82F6' })
          .select()
          .single();
        if (newHabit) setHabits([newHabit]);
      } else {
        setHabits(habitsData);
      }

      // 2. Obtener registros de hoy
      const { data: logsData, error: lError } = await supabase
        .from('habit_logs')
        .select('habit_id')
        .eq('completed_date', today);

      if (lError) throw lError;

      const logsMap: Record<string, boolean> = {};
      logsData?.forEach(log => {
        logsMap[log.habit_id] = true;
      });
      setLogs(logsMap);

    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert("Error", "No pudimos cargar tus hábitos. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = logs[habitId];

    try {
      if (isCompleted) {
        // Desmarcar: Borrar de la base de datos
        await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', habitId)
          .eq('completed_date', today);
        
        const newLogs = { ...logs };
        delete newLogs[habitId];
        setLogs(newLogs);
      } else {
        // Marcar: Insertar en la base de datos
        await supabase
          .from('habit_logs')
          .insert({ habit_id: habitId, completed_date: today });

        setLogs({ ...logs, [habitId]: true });
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mis Hábitos</Text>
        
        <View style={[styles.modeToggle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.toggleBtn, mode === 'build' && { backgroundColor: '#10B98120' }]}
            onPress={() => setMode('build')}
          >
            <Text style={[styles.toggleText, { color: mode === 'build' ? '#10B981' : colors.text }]}>Construir</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, mode === 'quit' && { backgroundColor: '#EF444420' }]}
            onPress={() => setMode('quit')}
          >
            <Text style={[styles.toggleText, { color: mode === 'quit' ? '#EF4444' : colors.text }]}>Dejar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {mode === 'build' ? (
          habits.map((habit) => (
            <View key={habit.id} style={[styles.habitCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.habitInfo}>
                <View style={[styles.iconWrap, { backgroundColor: habit.color + '20' }]}>
                  <Ionicons name="flash" size={24} color={habit.color} />
                </View>
                <View>
                  <Text style={[styles.habitTitle, { color: colors.text }]}>{habit.title}</Text>
                  <Text style={[styles.habitStreak, { color: colors.text + '80' }]}>
                    {logs[habit.id] ? '¡Completado hoy! ✨' : 'Pendiente hoy'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.checkBtn, 
                  { 
                    backgroundColor: logs[habit.id] ? colors.accent : 'transparent',
                    borderColor: logs[habit.id] ? colors.accent : colors.border 
                  }
                ]}
                onPress={() => toggleHabit(habit.id)}
              >
                <MaterialIcons name="done" size={24} color={logs[habit.id] ? 'white' : colors.border} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={[styles.quitCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.quitTitle, { color: colors.text }]}>Tiempo libre de Fumar</Text>
            <View style={styles.timerRow}>
              <View style={styles.timeBox}>
                <Text style={[styles.timeValue, { color: colors.text }]}>14</Text>
                <Text style={[styles.timeLabel, { color: colors.text + '80' }]}>Días</Text>
              </View>
              <Text style={[styles.timeSeparator, { color: colors.text }]}>:</Text>
              <View style={styles.timeBox}>
                <Text style={[styles.timeValue, { color: colors.text }]}>05</Text>
                <Text style={[styles.timeLabel, { color: colors.text + '80' }]}>Hrs</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.panicBtn, { backgroundColor: '#EF4444' }]} onPress={() => Alert.alert("¡Ánimo!", "Respira profundamente. Estás haciendo un gran trabajo.")}>
              <Text style={styles.panicText}>Registrar Ansiedad 📓</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 40 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  modeToggle: { flexDirection: 'row', borderRadius: 12, padding: 4, borderWidth: 1 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  toggleText: { fontSize: 16, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 24 },
  habitCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  habitInfo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrap: { padding: 12, borderRadius: 12 },
  habitTitle: { fontSize: 18, fontWeight: '600' },
  habitStreak: { fontSize: 14, marginTop: 4 },
  checkBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  quitCard: { padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  quitTitle: { fontSize: 18, fontWeight: '600', marginBottom: 24 },
  timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 },
  timeBox: { alignItems: 'center', backgroundColor: '#00000050', padding: 16, borderRadius: 16, minWidth: 80 },
  timeValue: { fontSize: 32, fontWeight: 'bold' },
  timeLabel: { fontSize: 14, marginTop: 4 },
  timeSeparator: { fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  panicBtn: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' },
  panicText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

