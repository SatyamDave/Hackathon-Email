# Azure OpenAI Setup Guide

## 🔑 Required Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Azure Active Directory Configuration
VITE_AZURE_CLIENT_ID=your_azure_client_id_here
VITE_AZURE_TENANT_ID=your_azure_tenant_id_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Azure OpenAI Configuration
VITE_AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
VITE_AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name_here
VITE_AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

## 🚀 Azure OpenAI Service Setup Steps

### 1. Create Azure OpenAI Resource
1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Azure OpenAI"
3. Click "Create" to create a new resource
4. Fill in the required details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Region**: Choose available region (East US, West Europe, etc.)
   - **Name**: Your resource name (this becomes part of the endpoint URL)
   - **Pricing Tier**: Select appropriate tier

### 2. Request Access (If Required)
- Azure OpenAI requires approval for access
- Submit application at https://aka.ms/oai/access
- Wait for approval (can take several days)

### 3. Deploy a Model
1. Once resource is created, go to "Model deployments"
2. Click "Create new deployment"
3. Choose a model:
   - **GPT-3.5-turbo**: Good for most tasks, cost-effective
   - **GPT-4**: More capable but more expensive
   - **GPT-4-turbo**: Latest model with improved capabilities
4. Set deployment name (use this as `VITE_AZURE_OPENAI_DEPLOYMENT_NAME`)

### 4. Get API Credentials
1. Go to your Azure OpenAI resource
2. Navigate to "Keys and Endpoint"
3. Copy:
   - **Key 1** → Use as `VITE_AZURE_OPENAI_API_KEY`
   - **Endpoint** → Use as `VITE_AZURE_OPENAI_ENDPOINT`

## 🔧 Usage in Application

The Azure OpenAI service is already integrated in `src/services/azureOpenAI.ts`. 

### Available Methods:

```typescript
import AzureOpenAIService from './services/azureOpenAI';

// Analyze email content
const analysis = await AzureOpenAIService.analyzeEmail({
  emailContent: "Your email content here",
  analysisType: 'summary' // or 'sentiment', 'action_items', 'priority', 'category'
});

// Generate email responses
const responses = await AzureOpenAIService.generateEmailResponse(
  "Original email content",
  "Additional context (optional)"
);

// Extract action items
const actionItems = await AzureOpenAIService.extractActionItems(
  "Email content with tasks"
);
```

## 💰 Cost Considerations

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **GPT-4**: ~$0.03 per 1K tokens  
- **GPT-4-turbo**: ~$0.01 per 1K tokens

Monitor usage in Azure portal to control costs.

## 🛡️ Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different keys** for development and production
3. **Implement rate limiting** to prevent abuse
4. **Monitor API usage** regularly
5. **Rotate API keys** periodically

## 🔍 Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check API key is correct
   - Verify endpoint URL format
   - Ensure resource is properly deployed

2. **403 Forbidden**
   - Check if access to Azure OpenAI is approved
   - Verify subscription has necessary permissions

3. **Model Not Found**
   - Ensure model is deployed in your resource
   - Check deployment name matches environment variable

4. **Rate Limit Exceeded**
   - Implement exponential backoff
   - Consider upgrading pricing tier
   - Monitor and optimize token usage

## 📞 Support

If you need help:
1. Check Azure OpenAI documentation
2. Review Azure portal for error messages
3. Contact Azure support for service-specific issues

---

**Note**: You are responsible for obtaining and managing your own Azure OpenAI API keys. The application provides the integration framework, but API costs and management are your responsibility. 