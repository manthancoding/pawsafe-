const { db } = require('./config/firebaseAdmin');

async function migrateRoles() {
    console.log('🚀 Starting Role Migration...');

    try {
        const usersSnapshot = await db.collection('users').get();
        console.log(`Found ${usersSnapshot.size} users.`);

        let updatedCount = 0;
        const batch = db.batch();

        usersSnapshot.forEach(doc => {
            const data = doc.data();
            const updates = {};
            let needsUpdate = false;

            // If user has 'role' but no 'roles' array
            if (data.role && !data.roles) {
                updates.roles = [data.role];
                needsUpdate = true;
            }

            // Default if nothing set
            if (!data.role && !data.roles) {
                updates.roles = ['user'];
                needsUpdate = true;
            }

            if (needsUpdate) {
                batch.update(doc.ref, updates);
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
            console.log(`✅ Successfully updated ${updatedCount} users.`);
        } else {
            console.log('✨ No users needed updating.');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrateRoles();
