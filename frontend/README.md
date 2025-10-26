# File Explorer Frontend

A modern Vue.js 3 file management application with a responsive UI for browsing, searching, and managing folders and files. Built with TypeScript, Vite.

## Features

- 📁 **Folder Tree Navigation** - Hierarchical folder structure with expandable/collapsible nodes
- 🔍 **Advanced Search** - Real-time search functionality that queries the backend API
- 📄 **File Management** - Create, rename, and delete files and folders
- 🍞 **Breadcrumb Navigation** - Easy navigation through folder hierarchy
- 📋 **Context Menu** - Right-click actions for quick operations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Built with Vite for optimized development and production builds

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend build tool
- **Axios** - HTTP client for API requests

## Project Structure

\`\`\`
src/
├── components/ # Vue components
│ ├── Breadcrumb.vue # Breadcrumb navigation
│ ├── ContextMenu.vue # Right-click context menu
│ ├── FolderContent.vue # Main content area
│ ├── FolderTree.vue # Folder tree sidebar
│ ├── SearchBar.vue # Search input component
│ ├── TreeNode.vue # Individual tree node
│ ├── InputField.vue # Reusable input field
│ ├── ModalDialog.vue # Modal dialog component
├── composables/ # Vue composables (hooks)
│ └── useSearch.ts # Search functionality hook
├── services/ # API services
│ ├── api.ts # Axios API client configuration
│ └── folderService.ts # Folder and file API methods
├── types/ # TypeScript type definitions
│ └── index.ts # Shared types and interfaces
├── App.vue # Root component
├── main.ts # Application entry point
└── style.css # Global styles
\`\`\`

## Installation

### Prerequisites

- Node.js 16+
- npm or bun package manager

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   bun install
   \`\`\`

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   \`\`\`env
   VITE_API_URL=http://localhost:3000/api/v1
   \`\`\`

4. **Start development server**
   \`\`\`bash
   npm run dev

   # or

   bun run dev
   \`\`\`

   The application will be available at `http://localhost:5173`

## Usage

### Development

\`\`\`bash

# Start development server with hot reload

npm run dev

# Build for production

npm run build

# Preview production build

npm run preview
\`\`\`

### Building

\`\`\`bash

# Create optimized production build

npm run build

# The build output will be in the `dist/` directory

\`\`\`

## API Integration

The application communicates with a backend API. All API calls are handled through the `folderService` module.

### API Endpoints

#### Folders

- `GET /folders/tree` - Get complete folder tree structure
- `GET /folders/{folderId}/children` - Get direct children of a folder
- `GET /folders/{folderId}/breadcrumb` - Get breadcrumb path to a folder
- `POST /folders` - Create a new folder
- `PATCH /folders/{id}` - Update folder name
- `DELETE /folders/{id}` - Delete a folder

#### Files

- `GET /files/folder/{folderId}` - Get files in a folder (with pagination)
- `POST /files` - Create a new file
- `PATCH /files/{id}` - Update file name
- `DELETE /files/{id}` - Delete a file

#### Search

- `GET /search?q={query}` - Search for folders and files

### API Configuration

The API client is configured in `src/services/api.ts`:

\`\`\`typescript
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
\`\`\`

The base URL can be customized via the `VITE_API_URL` environment variable.

## Components

### FolderTree

Displays the hierarchical folder structure with expandable nodes.

**Props:**

- `folders` - Array of folder tree nodes

**Events:**

- `select` - Emitted when a folder is selected

### SearchBar

Search input component with API integration.

**Props:**

- `placeholder` - Input placeholder text

**Events:**

- `search` - Emitted with search results

### FolderContent

Main content area displaying files and folders.

**Props:**

- `items` - Array of files and folders to display
- `loading` - Loading state

### Breadcrumb

Navigation breadcrumb showing current folder path.

**Props:**

- `path` - Array of folder objects in the path

**Events:**

- `navigate` - Emitted when a breadcrumb item is clicked

### ContextMenu

Right-click context menu for file/folder operations.

**Props:**

- `x` - X coordinate for menu position
- `y` - Y coordinate for menu position
- `item` - The file or folder being acted upon

**Events:**

- `action` - Emitted with the action type (rename, delete, etc.)

## Composables

### useSearch

Hook for managing search functionality.

\`\`\`typescript
const { results, loading, search } = useSearch();
await search('query');
\`\`\`

## Types

### FolderTreeNode

\`\`\`typescript
interface FolderTreeNode {
id: string;
name: string;
children?: FolderTreeNode[];
files?: FileDTO[];
}
\`\`\`

### FolderDTO

\`\`\`typescript
interface FolderDTO {
id: string;
name: string;
parentId: string | null;
createdAt: string;
updatedAt: string;
}
\`\`\`

### FileDTO

\`\`\`typescript
interface FileDTO {
id: string;
name: string;
folderId: string;
size: bigint;
mimeType: string;
createdAt: string;
updatedAt: string;
}
\`\`\`

### SearchResult

\`\`\`typescript
interface SearchResult {
folders: FolderDTO[];
files: FileDTO[];
}
\`\`\`

## Styling

Global styles are defined in `src/style.css`.

### Color Scheme

- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#6b7280)
- **Background**: White (#ffffff)
- **Text**: Dark Gray (#1f2937)

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Environment Variables

| Variable       | Description          | Default                        |
| -------------- | -------------------- | ------------------------------ |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- **Code Splitting** - Automatic with Vite
- **Tree Shaking** - Removes unused code
- **Lazy Loading** - Components loaded on demand
- **Caching** - API responses cached where appropriate

## Troubleshooting

### API Connection Issues

If you see "API Error" messages:

1. Verify the backend API is running
2. Check the `VITE_API_URL` environment variable
3. Ensure CORS is properly configured on the backend
4. Check browser console for detailed error messages

### Build Issues

\`\`\`bash

# Clear node_modules and reinstall

rm -rf node_modules
npm install

# Clear Vite cache

rm -rf .vite
npm run build
\`\`\`

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on the repository.
