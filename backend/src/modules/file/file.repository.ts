import { PrismaClient } from "@prisma/client";
import type { FileDTO } from "./file.types";

export class FileRepository {
  constructor(private prisma: PrismaClient) {}

  async getFilesByFolder(
    folderId: string,
    skip = 0,
    take = 100
  ): Promise<FileDTO[]> {
    return this.prisma.file.findMany({
      where: { folderId },
      orderBy: { name: "asc" },
      skip,
      take,
    });
  }

  async createFile(
    name: string,
    folderId: string,
    size: number,
    mimeType: string
  ): Promise<FileDTO> {
    return this.prisma.file.create({
      data: { name, folderId, size, mimeType },
    });
  }

  async deleteFile(id: string): Promise<void> {
    await this.prisma.file.delete({ where: { id } });
  }

  async searchFiles(query: string): Promise<FileDTO[]> {
    return this.prisma.file.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: { name: "asc" },
      take: 50,
    });
  }
}
