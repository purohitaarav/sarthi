const axios = require('axios');

async function testEndpoint() {
    const query = "What leads to the cycle of birth and death?";
    console.log(`🧪 Testing LLM Parsing with query: "${query}"...`);

    try {
        const start = Date.now();
        const response = await axios.post('http://localhost:5001/api/guidance/ask', {
            query: query,
            maxVerses: 2
        }, { timeout: 120000 });

        console.log(`✅ Success in ${Date.now() - start}ms`);
        console.log('Referenced Verses:');
        response.data.verses_referenced.forEach(v => {
            console.log(`[${v.reference}] ${v.translation.substring(0, 50)}...`);
        });

    } catch (err) {
        console.error('❌ Request failed:', err.message);
    }
}

testEndpoint();
