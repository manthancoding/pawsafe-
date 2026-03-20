const { db } = require('./config/firebaseAdmin');

async function test() {
    console.log('Testing Firestore connectivity...');
    try {
        const snapshot = await db.collection('animals').orderBy('createdAt', 'desc').limit(1).get();
        console.log('✅ Firestore query successful!');
        console.log('Count:', snapshot.size);
        if (snapshot.size > 0) {
            console.log('First animal:', snapshot.docs[0].data());
        } else {
            console.log('No animals found in collection.');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Firestore query failed:', error);
        process.exit(1);
    }
}

test();
