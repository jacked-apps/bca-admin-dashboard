/// these scripts dont really work in ts you have scripts in firebaseScripts folder here.   open a separate window

const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccountPath =
  '/Users/edpoplet/Desktop/Ed Projects/coding/coding secret files/expo-bca-app-firebase-adminsdk-tjxc5-8af3cc9e8a.json';
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const changeStructure = async () => {
  const querySnapshot = await db.collection('pastPlayers').get();
  const updates = [];

  querySnapshot.forEach(doc => {
    const playerData = doc.data();
    const stats = {
      SeasonOne: {
        wins: playerData.seasonOneWins || 0,
        losses: playerData.seasonOneLosses || 0,
      },
      SeasonTwo: {
        wins: playerData.seasonTwoWins || 0,
        losses: playerData.seasonTwoLosses || 0,
      },
      SeasonThree: {
        wins: playerData.seasonThreeWins || 0,
        losses: playerData.seasonThreeLosses || 0,
      },
    };
    updates.push({ id: doc.id, stats });
  });

  for (const { id, stats } of updates) {
    const playerRef = db.collection('pastPlayers').doc(id);
    await playerRef.update({
      stats,
      seasonOneWins: admin.firestore.FieldValue.delete,
      seasonOneLosses: admin.firestore.FieldValue.delete,
      seasonTwoWins: admin.firestore.FieldValue.delete,
      seasonTwoLosses: admin.firestore.FieldValue.delete,
      seasonThreeWins: admin.firestore.FieldValue.delete,
      seasonThreeLosses: admin.firestore.FieldValue.delete,
    }); // Only updates the stats field
    // Optionally, remove old fields here using playerRef.update({...})
  }
};

changeStructure();
