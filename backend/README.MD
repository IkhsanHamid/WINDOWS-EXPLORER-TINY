# File Explorer Backend API

A robust REST API for managing files and folders with hierarchical structure support, built with Elysia, Prisma, and PostgreSQL.

## Features

- **Folder Management**: Create, read, and delete folders with hierarchical structure
- **File Management**: Create, read, and delete files with metadata (size, MIME type)
- **Search Functionality**: Full-text search across files and folders
- **Pagination**: Efficient pagination for large file lists
- **Breadcrumb Navigation**: Get folder path from root to any folder
- **Cascading Deletes**: Automatic cleanup of child items when parent is deleted
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling with meaningful error messages
- **Health Checks**: Server health monitoring endpoint

## Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia (lightweight TypeScript web framework)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Joi for schema validation
- **CORS**: @elysiajs/cors

## Prerequisites

- Bun (latest version)
- PostgreSQL database
- Node.js 18+ (for compatibility)

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/file-explorer-backend.git
   cd file-explorer-backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   bun install
   \`\`\`

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@localhost:5432/file_explorer"
   DIRECT_URL="postgresql://user:password@localhost:5432/file_explorer"
   PORT=3000
   \`\`\`

4. **Set up the database**
   \`\`\`bash

   # Generate Prisma client

   bun run db:generate

   # Run migrations

   bun run db:push
   \`\`\`

## Running the Server

### Development Mode

\`\`\`bash
bun run dev
\`\`\`
The server will start on `http://localhost:3000` with hot reload enabled.

### Production Build

\`\`\`bash
bun run build
bun run start
\`\`\`

### Database Management

\`\`\`bash

# Generate Prisma client

bun run db:generate

# Run migrations

bun run db:migrate

# Push schema to database

bun run db:push

# Open Prisma Studio (GUI for database)

bun run db:studio
\`\`\`

## API Endpoints

### Health Check

- **GET** `/health` - Server health status and uptime

### Folders

- **GET** `/api/v1/folders/tree` - Get complete folder tree structure
- **GET** `/api/v1/folders/:id/children` - Get direct children of a folder
- **GET** `/api/v1/folders/:id/breadcrumb` - Get breadcrumb path to folder
- **POST** `/api/v1/folders` - Create a new folder
- **DELETE** `/api/v1/folders/:id` - Delete a folder (cascading)

### Files

- **GET** `/api/v1/files/folder/:folderId` - Get files in a folder (paginated)
  - Query params: `skip` (default: 0), `take` (default: 100)
- **POST** `/api/v1/files` - Create a new file
- **DELETE** `/api/v1/files/:id` - Delete a file

### Search

- **GET** `/api/v1/search?q=query` - Search files and folders (min 2 characters)

## API Examples

### Create a Folder

\`\`\`bash
curl -X POST http://localhost:3000/api/v1/folders \
 -H "Content-Type: application/json" \
 -d '{
"name": "My Folder",
"parentId": null
}'
\`\`\`

### Create a File

\`\`\`bash
curl -X POST http://localhost:3000/api/v1/files \
 -H "Content-Type: application/json" \
 -d '{
"name": "document.pdf",
"folderId": "folder-id-here",
"size": 1024000,
"mimeType": "application/pdf"
}'
\`\`\`

### Get Folder Tree

\`\`\`bash
curl http://localhost:3000/api/v1/folders/tree
\`\`\`

### Get Files in Folder (Paginated)

\`\`\`bash
curl "http://localhost:3000/api/v1/files/folder/folder-id-here?skip=0&take=20"
\`\`\`

### Search Files and Folders

\`\`\`bash
curl "http://localhost:3000/api/v1/search?q=document"
\`\`\`

### Get Folder Breadcrumb

\`\`\`bash
curl http://localhost:3000/api/v1/folders/folder-id-here/breadcrumb
\`\`\`

## Database Schema

### Folder Model

\`\`\`prisma
model Folder {
id String @id @default(cuid())
name String
parentId String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
files File[]
parent Folder? @relation("FolderHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
children Folder[] @relation("FolderHierarchy")
}
\`\`\`

### File Model

\`\`\`prisma
model File {
id String @id @default(cuid())
name String
folderId String
size Decimal @db.Decimal
mimeType String @default("application/octet-stream")
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
folder Folder @relation(fields: [folderId], references: [id], onDelete: Cascade)
}
\`\`\`

## Project Structure

\`\`\`
src/
├── config/
│ └── database.ts # Database configuration
├── middleware/
│ └── error.middleware.ts # Global error handling
├── modules/
│ ├── file/
│ │ ├── file.controller.ts
│ │ ├── file.repository.ts
│ │ ├── file.routes.ts
│ │ ├── file.service.ts
│ │ └── file.types.ts
│ ├── folder/
│ │ ├── folder.controller.ts
│ │ ├── folder.repository.ts
│ │ ├── folder.routes.ts
│ │ ├── folder.service.ts
│ │ └── folder.types.ts
│ └── search/
│ ├── search.controller.ts
│ ├── search.routes.ts
│ ├── search.service.ts
│ └── search.types.ts
├── utils/
│ └── errors.ts # Custom error classes
├── validation/
│ ├── schemas.ts # Joi validation schemas
│ └── validator.ts # Validation utilities
└── index.ts # Application entry point
\`\`\`

## Error Handling

The API returns standardized error responses:

\`\`\`json
{
"error": "Error message",
"statusCode": 400,
"timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

Common error codes:

- `400` - Bad Request (validation error)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Validation

Request bodies are validated using Joi schemas. Invalid requests will return a 400 status with validation error details.

### Folder Creation Validation

- `name` (required): String, non-empty
- `parentId` (optional): Valid folder ID

### File Creation Validation

- `name` (required): String, non-empty
- `folderId` (required): Valid folder ID
- `size` (required): Number, positive
- `mimeType` (required): String, valid MIME type

## Performance Considerations

- **Pagination**: Use `skip` and `take` parameters for large file lists
- **Indexing**: Database indexes on `parentId` and `folderId` for fast queries
- **Cascading Deletes**: Efficiently handled by PostgreSQL constraints
- **CORS**: Enabled for cross-origin requests

## Development

### Running Tests

\`\`\`bash
bun test
\`\`\`

### Code Structure

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data processing
- **Repositories**: Database access layer
- **Types**: TypeScript interfaces and types
- **Validation**: Input validation schemas

## Deployment

### Environment Variables for Production

\`\`\`env
DATABASE_URL="postgresql://user:password@prod-db:5432/file_explorer"
DIRECT_URL="postgresql://user:password@prod-db:5432/file_explorer"
PORT=3000
NODE_ENV=production
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## Changelog

### Version 1.0.0

- Initial release
- Folder management with hierarchical structure
- File management with metadata
- Search functionality
- Pagination support
- Breadcrumb navigation
- Comprehensive error handling
