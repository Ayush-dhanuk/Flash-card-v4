import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomModal({ visible, title, message, type = 'success', onClose, onConfirm, showCancel = false, isDarkMode }) {
  if (!visible) return null;

  const themeCard = isDarkMode ? '#121212' : '#FFFFFF';
  const themeText = isDarkMode ? '#FFFFFF' : '#0F172A';
  const themeBorder = isDarkMode ? '#27272A' : '#E2E8F0';

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: themeCard, borderColor: themeBorder }]}>
          <View style={[styles.iconCircle, type === 'danger' ? styles.iconDanger : styles.iconSuccess]}>
            <Ionicons
              name={type === 'danger' ? 'trash-outline' : 'checkmark-circle-outline'}
              size={34}
              color={type === 'danger' ? '#EF4444' : '#10B981'}
            />
          </View>

          <Text style={[styles.title, { color: themeText }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.btnRow}>
            {showCancel && (
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmBtn, type === 'danger' ? styles.btnDanger : styles.btnSuccess]}
              onPress={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
            >
              <Text style={styles.confirmTxt}>{type === 'danger' ? 'Delete' : 'OK'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '88%', padding: 24, borderRadius: 24, borderWidth: 1, alignItems: 'center', elevation: 12 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  iconSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  iconDanger: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: '#A1A1AA', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  btnRow: { flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#27272A', alignItems: 'center' },
  cancelTxt: { color: '#A1A1AA', fontWeight: '700', fontSize: 15 },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnSuccess: { backgroundColor: '#4F46E5' },
  btnDanger: { backgroundColor: '#EF4444' },
  confirmTxt: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
    
