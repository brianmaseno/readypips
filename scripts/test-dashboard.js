const fetch = require('node-fetch');

async function testDashboardAPI() {
    try {
        console.log('Testing Dashboard API...');

        // First, let's test the signals API to see what it returns
        console.log('\n1. Testing /api/signals endpoint...');
        const signalsResponse = await fetch('https://www.readypips.com/api/signals');
        const signalsData = await signalsResponse.json();
        console.log('Signals API Response:', JSON.stringify(signalsData, null, 2));

        // Now test the dashboard API (this will fail without auth, but we can see the structure)
        console.log('\n2. Testing /api/dashboard endpoint...');
        const dashboardResponse = await fetch('https://www.readypips.com/api/dashboard', {
            headers: {
                'Authorization': 'Bearer invalid-token'
            }
        });
        const dashboardData = await dashboardResponse.json();
        console.log('Dashboard API Response:', JSON.stringify(dashboardData, null, 2));

    } catch (error) {
        console.error('Error testing APIs:', error.message);
    }
}

testDashboardAPI(); 