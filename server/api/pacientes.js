import { getFirestore } from 'firebase-admin/firestore';

export const getPatientsAPI = async (req, res) => {
  const db = getFirestore();
  const snapshot = await db.collection('pacientes').get();
  const patients = snapshot.docs.map(doc => doc.data());
  
  res.json(patients);
};
