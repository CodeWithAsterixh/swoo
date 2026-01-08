const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://peterpaultolulope:asterixh@codewithasterixh.mf0e733.mongodb.net/?appName=CodeWithAsterixh';

async function check() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'swoocards',
      serverSelectionTimeoutMS: 5000,
    });

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const users = await db.collection('users').find({}).toArray();
    console.log('Users in DB:', JSON.stringify(users, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
