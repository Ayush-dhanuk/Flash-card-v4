import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';

export default function CustomModal({ visible, title, message, type = 'default', showCancel = false, isDarkMode, onClose, onConfirm }) {
  const bg = isDarkMode ? '#18181B' : '#FFFFFF';
  const textCol = isDarkMode ? '#FFFFFF' : '#0F172A';
  const subCol = isDarkMode ? '#A1A1AA' : '#64748B';
  const confirmBg = type === 'danger' ? '#EF4444' : '#4F46E5';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: bg }]}>
          <Text style={[styles.title, { color: textCol }]}>{title}</Text>
          <Text style={[styles.message, { color: subCol }]}>{message}</Text>
          
          <View style={styles.btnRow}>
            {showCancel && (
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.btn, { backgroundColor: confirmBg, flex: showCancel ? 1 : 2 }, showCancel && { marginLeft: 10 }]} onPress={onConfirm}>
              <Text style={styles.confirmTxt}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', maxWidth: 340, borderRadius: 20, padding: 24, alignItems: 'center', elevation: 6 },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  message: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  btnRow: { flexDirection: 'row', width: '100%' },
  btn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { flex: 1, backgroundColor: '#E2E8F0', marginRight: 10 },
  cancelTxt: { color: '#334155', fontWeight: '600', fontSize: 14 },
  confirmTxt: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});
    
