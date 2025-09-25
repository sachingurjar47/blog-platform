# Blog Platform

A modern, full-featured blog platform built with Next.js, React, and TypeScript. This platform provides a complete blogging experience with rich text editing, user authentication, image management, and real-time features.

## 🚀 Features

### 📝 Content Management

- **Rich Text Editor**: Powered by Editor.js with extensive formatting options
  - Headers (H1-H6)
  - Paragraphs with inline formatting
  - Lists (ordered and unordered)
  - Quotes with author attribution
  - Code blocks with syntax highlighting
  - Inline code formatting
  - Text highlighting and underlining
  - Tables for structured data
  - Delimiters for content separation
  - Warning blocks for important notices

### 🖼️ Image Management

- **Image Upload**: Direct file upload with drag-and-drop support
- **Image Fetching**: Support for external image URLs from trusted sources
- **Image Cleanup**: Automatic cleanup of unused images
- **File Validation**: Image type validation and size limits (10MB max)
- **Secure Storage**: Images stored in `/public/uploads/` directory

### 👤 User Authentication & Authorization

- **User Registration**: Email-based registration with validation
- **User Login**: Secure authentication with JWT tokens
- **Protected Routes**: Authentication-required pages and API endpoints
- **Session Management**: Persistent login with secure cookie storage
- **User Profile**: Basic user information management

### 🔍 Search & Discovery

- **Real-time Search**: Debounced search with instant results
- **Infinite Scroll**: Seamless pagination for large content sets
- **Search Results Info**: Clear indication of search results and total count
- **Content Filtering**: Search across post titles and content

### 📱 User Experience

- **Responsive Design**: Mobile-first design with Material-UI components
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error states and user feedback
- **Toast Notifications**: Real-time feedback for user actions
- **Modern UI**: Clean, intuitive interface with Material Design principles

### ⚡ Performance & Optimization

- **Server-Side Rendering**: Next.js SSR for optimal performance
- **Client-Side Hydration**: Smooth client-side interactions
- **Code Splitting**: Automatic code splitting for faster load times
- **Image Optimization**: Efficient image handling and delivery
- **Caching**: React Query for intelligent data caching

### 🛠️ Developer Experience

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency enforcement
- **Testing**: Jest and React Testing Library for comprehensive testing
- **Hot Reload**: Fast development with Turbopack
- **API Routes**: RESTful API endpoints with proper error handling

## 🏗️ Technology Stack

### Frontend

- **Next.js 15.5.3**: React framework with SSR and API routes
- **React 19.1.0**: Modern React with latest features
- **TypeScript 5**: Type-safe JavaScript development
- **Material-UI 7.3.2**: Comprehensive UI component library
- **Emotion**: CSS-in-JS styling solution
- **React Query 5.90.1**: Data fetching and state management
- **Editor.js 2.31.0**: Block-style rich text editor

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **JWT**: JSON Web Tokens for authentication
- **Formidable**: File upload handling
- **UUID**: Unique identifier generation
- **Yup**: Schema validation

### Development Tools

- **ESLint 9**: Code linting and formatting
- **Jest 30.1.3**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Turbopack**: Fast bundler for development

### Editor.js Plugins

- `@editorjs/header`: Headers and titles
- `@editorjs/paragraph`: Text paragraphs
- `@editorjs/list`: Ordered and unordered lists
- `@editorjs/quote`: Blockquotes with attribution
- `@editorjs/code`: Code blocks
- `@editorjs/image`: Image handling
- `@editorjs/inline-code`: Inline code formatting
- `@editorjs/marker`: Text highlighting
- `@editorjs/delimiter`: Content separators
- `@editorjs/underline`: Text underlining
- `@editorjs/table`: Data tables
- `@editorjs/warning`: Warning blocks
- `@editorjs/embed`: Media embeds
- `@editorjs/link`: Link management

## 📁 Project Structure

```
blog-platform/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AppBar.tsx      # Navigation bar
│   │   ├── Layout.tsx      # Page layout wrapper
│   │   ├── PostCard.tsx    # Individual post display
│   │   ├── RichTextEditor.tsx # Editor.js integration
│   │   ├── EditorJSRenderer.tsx # Content rendering
│   │   └── ...
│   ├── pages/              # Next.js pages and API routes
│   │   ├── api/           # API endpoints
│   │   │   ├── auth-check.ts
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   ├── upload-image.ts
│   │   │   └── posts/     # Post-related APIs
│   │   ├── index.tsx      # Home page
│   │   ├── create-post.tsx # Post creation
│   │   ├── edit-post/     # Post editing
│   │   └── posts/         # Individual post pages
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication logic
│   │   └── usePosts.ts    # Post management
│   ├── lib/               # Utility libraries
│   │   ├── db.ts          # Database operations
│   │   ├── jwt.ts         # JWT handling
│   │   └── api.ts         # API client
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   ├── schemas/           # Validation schemas
│   └── __tests__/         # Test files
├── public/                # Static assets
│   └── uploads/          # User-uploaded images
├── data.json             # JSON database
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd blog-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production with Turbopack
- `npm run start`: Start production server
- `npm run lint`: Run ESLint for code quality

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# JWT Secret (required for production)
JWT_SECRET=your-super-secret-jwt-key

# Optional: Database configuration
DATABASE_URL=your-database-url
```

### Database

The application uses a JSON file (`data.json`) as the database by default. For production, consider migrating to a proper database like PostgreSQL or MongoDB.

## 📖 API Documentation

### Authentication Endpoints

#### POST `/api/register`

Register a new user

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/login`

Login user

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth-check`

Check authentication status

- **Headers**: `Authorization: Bearer <token>`

### Post Endpoints

#### GET `/api/posts`

Get paginated posts

- **Query Parameters**: `page`, `limit`, `search`
- **Headers**: `Authorization: Bearer <token>`

#### POST `/api/posts/create`

Create a new post

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "Post Title", "content": EditorJSData }`

#### GET `/api/posts/[id]`

Get a specific post

- **Headers**: `Authorization: Bearer <token>`

#### PUT `/api/posts/[id]`

Update a post

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "Updated Title", "content": EditorJSData }`

#### DELETE `/api/posts/[id]`

Delete a post

- **Headers**: `Authorization: Bearer <token>`

### Image Endpoints

#### POST `/api/upload-image`

Upload an image file

- **Content-Type**: `multipart/form-data`
- **Body**: `{ "image": File }`

#### POST `/api/fetch-image`

Fetch image from URL

- **Body**: `{ "url": "https://example.com/image.jpg" }`

#### DELETE `/api/delete-image`

Delete an uploaded image

- **Body**: `{ "imageUrl": "/uploads/filename.jpg" }`

## 🧪 Testing

The project includes comprehensive testing setup:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint testing
- **Component Tests**: React component behavior testing

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Deployment Options

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Docker**: Containerized deployment
- **Traditional Hosting**: Any Node.js hosting service

### Environment Setup

1. Set production environment variables
2. Configure database (if not using JSON)
3. Set up image storage (AWS S3, Cloudinary, etc.)
4. Configure domain and SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Material-UI](https://mui.com/) - React component library
- [Editor.js](https://editorjs.io/) - Block-style editor
- [React Query](https://tanstack.com/query) - Data fetching library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📞 Support

For support, email support@blogplatform.com or create an issue in the repository.

---

**Built with ❤️ using Next.js, React, and TypeScript**
