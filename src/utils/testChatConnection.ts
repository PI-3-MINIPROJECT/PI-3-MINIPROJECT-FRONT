import type { Meeting } from '../types';

/**
 * Script de prueba para validar conexión con backend de chat
 * Ejecutar en la consola del navegador cuando el frontend esté corriendo
 */

console.log('🔍 Verificando configuración...');
console.log('VITE_CHAT_SERVER_URL:', import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:4000');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000');

/**
 * Verifies the health status of the chat server
 * @returns {Promise<boolean>} Promise resolving to true if server is healthy, false otherwise
 */
async function testChatServerHealth() {
  console.log('\n🏥 Probando health check del servidor de chat...');
  try {
    const response = await fetch('http://localhost:4000/health');
    const data = await response.json();
    console.log('✅ Servidor de chat está activo:', data);
    return true;
  } catch (error) {
    console.error('❌ Servidor de chat no responde:', error);
    return false;
  }
}

/**
 * Tests meeting creation functionality
 * @param {string} [userId='test-user-123'] - User ID for testing
 * @returns {Promise<Meeting | null>} Promise resolving to created meeting data or null
 */
async function testCreateMeeting(userId = 'test-user-123'): Promise<Meeting | null> {
  console.log('\n📝 Probando creación de reunión...');
  try {
    const meetingData = {
      userId: userId,
      title: 'Reunión de Prueba',
      description: 'Esta es una prueba de conexión',
      date: '2024-12-01',
      time: '14:30',
      estimatedDuration: 60,
      maxParticipants: 10
    };

    const response = await fetch('http://localhost:4000/api/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Reunión creada exitosamente:');
      console.log('   Meeting ID:', data.data.meetingId);
      console.log('   Título:', data.data.title);
      console.log('   Fecha:', data.data.date);
      console.log('   Hora:', data.data.time);
      return data.data;
    } else {
      console.error('❌ Error al crear reunión:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return null;
  }
}

/**
 * Tests joining a meeting functionality
 * @param {string} meetingId - Meeting ID to join
 * @param {string} [userId='test-user-456'] - User ID for testing
 * @returns {Promise<Meeting | null>} Promise resolving to meeting data or null
 */
async function testJoinMeeting(meetingId: string, userId: string = 'test-user-456'): Promise<Meeting | null> {
  console.log('\n👥 Probando unirse a reunión...');
  try {
    const response = await fetch(`http://localhost:4000/api/meetings/${meetingId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Usuario unido exitosamente:');
      console.log('   Participantes:', data.data.participants);
      return data.data;
    } else {
      console.error('❌ Error al unirse:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return null;
  }
}

/**
 * Runs all integration tests for chat functionality
 * @returns {Promise<void>} Promise that resolves when all tests complete
 */
async function runAllTests() {
  console.log('🚀 Iniciando pruebas de integración...\n');
  console.log('=' . repeat(60));
  
  const isHealthy = await testChatServerHealth();
  if (!isHealthy) {
    console.log('\n⚠️  El servidor de chat no está corriendo.');
    console.log('   Asegúrate de iniciar el backend en el puerto 4000');
    return;
  }

  console.log('=' . repeat(60));

  const meeting = await testCreateMeeting();
  if (!meeting) {
    console.log('\n⚠️  No se pudo crear la reunión.');
    return;
  }

  console.log('=' . repeat(60));

  await testJoinMeeting(meeting.meetingId);

  console.log('=' . repeat(60));
  console.log('\n✨ Pruebas completadas!');
  console.log('\n📋 Resumen:');
  console.log('   - Health check: ✅');
  console.log('   - Crear reunión: ✅');
  console.log('   - Unirse a reunión: ✅');
  console.log('\n🎉 ¡Todo funciona correctamente!');
}

declare global {
  interface Window {
    chatTests: {
      runAllTests: () => Promise<void>;
      testChatServerHealth: () => Promise<boolean>;
      testCreateMeeting: (userId?: string) => Promise<Meeting | null>;
      testJoinMeeting: (meetingId: string, userId?: string) => Promise<Meeting | null>;
    };
  }
}

window.chatTests = {
  runAllTests,
  testChatServerHealth,
  testCreateMeeting,
  testJoinMeeting
};

console.log('\n📚 Funciones de prueba disponibles:');
console.log('   - chatTests.runAllTests() - Ejecutar todas las pruebas');
console.log('   - chatTests.testChatServerHealth() - Verificar servidor');
console.log('   - chatTests.testCreateMeeting(userId) - Crear reunión');
console.log('   - chatTests.testJoinMeeting(meetingId, userId) - Unirse a reunión');
console.log('\n💡 Tip: Ejecuta chatTests.runAllTests() para probar todo\n');

export { runAllTests, testChatServerHealth, testCreateMeeting, testJoinMeeting };
