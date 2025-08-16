# Expensy - API Client Implementation

This project includes a comprehensive REST client for making API calls to the backend service.

## API Client Features

- **Type-safe API calls** with TypeScript interfaces
- **Comprehensive error handling** for network and HTTP errors
- **Automatic retry logic** for failed requests
- **Loading states** and user feedback
- **Environment-based configuration**

## API Endpoints

### Categories
- **GET** `/api/categories` - Fetch all available categories
- **Response**: Array of categories with `id` and `name` fields

### Records
- **POST** `/api/records` - Create a new transaction record
- **Payload**:
  ```json
  {
    "description": "Compra de víveres",
    "amount": 150.75,
    "date": "2025/08/10",
    "category": 1
  }
  ```

## Configuration

The API base URL can be configured using environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://192.168.0.243:8000/api
```

Default fallback: `http://192.168.0.243:8000/api`

## Usage

### Using the API Client Directly

```typescript
import { apiClient } from '@/lib/api-client'

// Fetch categories
const categories = await apiClient.getCategories()

// Create a record
const newRecord = await apiClient.createRecord({
  description: "Compra de víveres",
  amount: 150.75,
  date: "2025/08/10",
  category: 1
})
```

### Using the Custom Hook

```typescript
import { useTransactionForm } from '@/hooks/use-transaction-form'

function MyComponent() {
  const {
    categories,
    isLoading,
    error,
    isSuccess,
    createTransaction,
    clearError,
    clearSuccess
  } = useTransactionForm()

  // The hook automatically fetches categories on mount
  // and provides methods for creating transactions
}
```

## Error Handling

The API client handles various types of errors:

- **Network errors** (connection issues)
- **HTTP errors** (4xx, 5xx responses)
- **Validation errors** from the backend
- **Timeout errors** for long-running requests

All errors are wrapped in a custom `ApiError` class with:
- `message`: Human-readable error message
- `status`: HTTP status code (if applicable)
- `details`: Additional error details

## File Structure

```
lib/
├── api-client.ts      # Main API client implementation
├── types.ts           # TypeScript interfaces
└── config.ts          # Configuration settings

hooks/
└── use-transaction-form.ts  # Custom hook for transaction management
```

## Best Practices

1. **Always use the custom hook** for form-related API calls
2. **Handle loading states** to provide user feedback
3. **Display error messages** when API calls fail
4. **Use TypeScript interfaces** for type safety
5. **Configure environment variables** for different deployment environments
