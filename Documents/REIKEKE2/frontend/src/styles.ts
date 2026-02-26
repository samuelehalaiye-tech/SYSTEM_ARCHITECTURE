import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  header: { padding: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#FF8C00', fontSize: 16, marginLeft: 8 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  formWrapper: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  titleSection: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF8C00' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, color: '#374151', marginBottom: 8 },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FAFAFA'
  },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 16 },
  submitButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  buttonPressed: { backgroundColor: '#FF7700', opacity: 0.9 },
  toggleContainer: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#4B5563', fontSize: 14 },
  toggleTextHighlight: { color: '#FF8C00', fontWeight: 'bold' },
});