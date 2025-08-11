export const getPatients = async () => {
  const db = getFirestore();
  const patientsSnapshot = await db.collection('pacientes').get();
  return patientsSnapshot.docs.map(doc => doc.data());
};
