# Interview Helper Project - Copilot Instructions

## Project Overview
Interview Helper is a web application built with React that helps users prepare for technical interviews. The application provides:

- Knowledge base sections organized by topics
- Interview questions with AI-generated answers
- AI chat functionality for custom questions
- Multiple AI model support (OpenAI, Google Gemini, Mistral, OpenChat)
- Localization support (Vietnamese and English)
- Google Sheets integration for data storage and retrieval

## Project Structure

- `/src/api/` - API integration for different AI models
- `/src/components/` - React components including icons and UI elements
- `/src/hooks/` - Custom React hooks for state management and functionality
- `/src/locales/` - Localization files for Vietnamese (`vi.ts`) and English
- `/src/pages/` - Main application pages and routes
- `/src/services/` - Service layer including Google Sheets integration

## Coding Conventions

### Components
- Use functional components with hooks
- Organize component files with the same name as the component
- Group related components in subdirectories

### TypeScript
- Define proper interfaces for props and state
- Use TypeScript for type safety throughout the project

### Localization
- Use translation keys from the localization files
- Format: `t('namespace.key')` or `t('namespace.section.key')`
- Always provide both Vietnamese and English translations

### Styling
- Use Tailwind CSS for styling components
- Use consistent class naming conventions

## Common Tasks

### Adding a New Feature
1. Create necessary components in the `/src/components/` directory
2. Add localization keys to `/src/locales/vi.ts` and English equivalent
3. Create page component if needed in `/src/pages/`
4. Update routing if necessary

### Adding a New AI Model
1. Create API integration in `/src/api/chat.ts`
2. Add model options in the appropriate components
3. Add localization keys for the model name and description
4. Update settings page to include API key configuration

### Adding New Localization Keys
1. Add keys to `/src/locales/vi.ts` in the appropriate section
2. Ensure English translation is also available
3. Use consistent naming with existing keys

## API Integration

### Google Sheets
- Uses Google Sheets API for storing and retrieving knowledge base and interview questions
- Requires proper authentication with API keys
- Sheet structure includes specific columns for categories, questions, and content

### AI Models
- OpenAI: GPT-3.5 and GPT-4 models
- Google Gemini: Gemini Pro model
- Mistral: Small model integration
- OpenChat: Version 3.5 integration

## User Authentication
- Local authentication stored in browser
- Social authentication via GitHub and Google
- User settings and data synced based on authentication status

## Best Practices
- Use React hooks appropriately (useCallback, useMemo, useEffect)
- Implement proper error handling for API calls
- Follow consistent naming conventions
- Keep components modular and reusable
- Implement responsive design for all screen sizes