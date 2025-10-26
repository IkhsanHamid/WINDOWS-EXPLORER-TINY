import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { PrismaClient } from "@prisma/client";
import { FolderController } from "./modules/folder/folder.controller";
import { FolderService } from "./modules/folder/folder.service";
import { FolderRepository } from "./modules/folder/folder.repository";
import { FileController } from "./modules/file/file.controller";
import { FileService } from "./modules/file/file.service";
import { FileRepository } from "./modules/file/file.repository";
import { createErrorMiddleware } from "./middleware/error.middleware";
import { SearchService } from "./modules/search/search.service";
import { SearchController } from "./modules/search/search.controller";

const prisma = new PrismaClient();

const app = new Elysia()
  .use(cors())
  .use(createErrorMiddleware)
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
  }));

// Initialize repositories
const folderRepo = new FolderRepository(prisma);
const fileRepo = new FileRepository(prisma);

// Initialize services
const folderService = new FolderService(folderRepo);
const fileService = new FileService(fileRepo);
const searachService = new SearchService(folderService, fileService);

// Initialize controllers
const folderController = new FolderController(folderService);
const fileController = new FileController(fileService);
const searchController = new SearchController(searachService);

// Register routes
folderController.registerRoutes(app);
fileController.registerRoutes(app);
searchController.registerRoutes(app);

const PORT = parseInt(process.env.PORT || "3000");

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 API: http://localhost:${PORT}/api/v1`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("🛑 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
