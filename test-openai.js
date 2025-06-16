import dotenv from 'dotenv';
import { AzureOpenAI } from 'openai';

// Load environment variables
dotenv.config();

console.log('Environment variables loaded:');
console.log('API Key:', process.env.VITE_AZURE_OPENAI_API_KEY ? 'Present ✓' : 'Missing ✗');
console.log('Endpoint:', process.env.VITE_AZURE_OPENAI_ENDPOINT || 'Missing');
console.log('Deployment:', process.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || 'Missing');
console.log('API Version:', process.env.VITE_AZURE_OPENAI_API_VERSION || 'Missing');

const client = new AzureOpenAI({
  apiKey: process.env.VITE_AZURE_OPENAI_API_KEY,
  endpoint: process.env.VITE_AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.VITE_AZURE_OPENAI_API_VERSION,
});

async function testConnection() {
  try {
    console.log('\nTesting Azure OpenAI connection...');
    
    const response = await client.chat.completions.create({
      model: process.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: [
        {
          role: 'user',
          content: 'Hello! This is a test message. Please respond briefly.'
        }
      ],
      max_tokens: 50
    });

    console.log('✅ Connection successful!');
    console.log('Response:', response.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.error('Error:', error.message);
    
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.code) {
      console.error('Code:', error.code);
    }
  }
}

testConnection(); 