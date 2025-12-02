const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://peterpaultolulope:asterixh@codewithasterixh.mf0e733.mongodb.net/?appName=CodeWithAsterixh';

async function cleanup() {
  try {
    // Connect to test DB (where data was mistakenly stored)
    await mongoose.connect(MONGO_URI, {
      dbName: 'test',
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Connected to test database');
    const testDb = mongoose.connection.db;
    const testCollections = await testDb.listCollections().toArray();
    console.log('Collections in test DB:', testCollections.map(c => c.name));

    // Delete users from test DB
    if (testCollections.some(c => c.name === 'users')) {
      await testDb.collection('users').deleteMany({});
      console.log('Cleared users from test DB');
    }

    await mongoose.disconnect();

    // Now check swoocards DB
    await mongoose.connect(MONGO_URI, {
      dbName: 'swoocards',
      serverSelectionTimeoutMS: 5000,
    });

    console.log('\nConnected to swoocards database');
    const swooDB = mongoose.connection.db;
    const swooCollections = await swooDB.listCollections().toArray();
    console.log('Collections in swoocards DB:', swooCollections.map(c => c.name));

    const users = await swooDB.collection('users').find({}).toArray();
    console.log('Users in swoocards DB:', users);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

cleanup();
