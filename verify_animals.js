const fetch = require('node-fetch');

async function verify() {
    console.log('🔍 Verifying /api/animals endpoint...');
    try {
        const res = await fetch('http://localhost:5000/api/animals');
        const result = await res.json();
        if (result.success) {
            console.log(`✅ Success! Found ${result.data.length} animals.`);
            console.log('Sample animal:', result.data[0].name);
        } else {
            console.error('❌ Failed to fetch animals:', result.message);
        }
    } catch (err) {
        console.error('❌ Error during verification:', err.message);
    }
}

verify();
