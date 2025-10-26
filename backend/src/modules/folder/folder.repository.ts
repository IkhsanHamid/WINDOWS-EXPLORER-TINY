import { PrismaClient } from "@prisma/client";
import type {
  FolderDTO,
  FolderWithChildren,
  CreateFolderRequest,
} from "./folder.types";
import { NotFoundError } from "../../utils/errors";

export class FolderRepository {
  constructor(private prisma: PrismaClient) {}

  async getRootFolders(): Promise<FolderDTO[]> {
    return this.prisma.folder.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    });
  }

  async getFolderById(id: string): Promise<FolderDTO | null> {
    return this.prisma.folder.findUnique({ where: { id } });
  }

  async getFolderWithChildren(id: string): Promise<FolderWithChildren | null> {
    return this.prisma.folder.findUnique({
      where: { id },
      include: {
        children: { orderBy: { name: "asc" } },
      },
    });
  }

  async getDirectChildren(parentId: string): Promise<FolderDTO[]> {
    const parent = await this.getFolderById(parentId);
    if (!parent) throw new NotFoundError(`Folder ${parentId} not found`);

    return this.prisma.folder.findMany({
      where: { parentId },
      orderBy: { name: "asc" },
    });
  }

  async createFolder(name: string, parentId?: string): Promise<FolderDTO> {
    if (parentId) {
      const parent = await this.getFolderById(parentId);
      if (!parent)
        throw new NotFoundError(`Parent folder ${parentId} not found`);
    }

    return this.prisma.folder.create({
      data: { name, parentId },
    });
  }

  async updateFolder(id: string, data: { name?: string }): Promise<FolderDTO> {
    const folder = await this.getFolderById(id);
    if (!folder) throw new NotFoundError(`Folder ${id} not found`);

    return this.prisma.folder.update({ where: { id }, data });
  }

  async deleteFolder(id: string): Promise<void> {
    const folder = await this.getFolderById(id);
    if (!folder) throw new NotFoundError(`Folder ${id} not found`);

    await this.prisma.folder.delete({ where: { id } });
  }

  async searchFolders(query: string): Promise<FolderDTO[]> {
    return this.prisma.folder.findMany({
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

  async getFolderAncestors(id: string): Promise<FolderDTO[]> {
    const folder = await this.getFolderById(id);
    if (!folder || !folder.parentId) return [];

    const ancestors: FolderDTO[] = [];
    let current = folder;

    while (current.parentId) {
      const parent = await this.getFolderById(current.parentId);
      if (!parent) break;
      ancestors.unshift(parent);
      current = parent;
    }

    return ancestors;
  }

  async getFolderCount(): Promise<number> {
    return this.prisma.folder.count();
  }

  async getDescendantCount(id: string): Promise<number> {
    const folder = await this.getFolderById(id);
    if (!folder) return 0;

    const countDescendants = async (folderId: string): Promise<number> => {
      const children = await this.prisma.folder.count({
        where: { parentId: folderId },
      });
      return children;
    };

    return countDescendants(id);
  }
}
