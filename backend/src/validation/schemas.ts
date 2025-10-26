import Joi from "joi";

export const CreateFolderSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    "string.empty": "Folder name cannot be empty",
    "string.max": "Folder name must not exceed 255 characters",
    "any.required": "Folder name is required",
  }),
  parentId: Joi.string().optional().messages({
    "string.base": "Parent ID must be a string",
  }),
}).unknown(false);

export const CreateFileSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    "string.empty": "File name cannot be empty",
    "string.max": "File name must not exceed 255 characters",
    "any.required": "File name is required",
  }),
  folderId: Joi.string().required().messages({
    "any.required": "Folder ID is required",
  }),
  size: Joi.number().min(0).required().messages({
    "number.min": "File size cannot be negative",
    "any.required": "File size is required",
  }),
  mimeType: Joi.string().trim().min(1).required().messages({
    "string.empty": "MIME type cannot be empty",
    "any.required": "MIME type is required",
  }),
}).unknown(false);

export const FolderIdSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Folder ID is required",
  }),
}).unknown(false);

export const FileIdSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "File ID is required",
  }),
}).unknown(false);

export const PaginationSchema = Joi.object({
  skip: Joi.number().min(0).default(0).messages({
    "number.min": "Skip must be non-negative",
  }),
  take: Joi.number().min(1).max(1000).default(100).messages({
    "number.min": "Take must be at least 1",
    "number.max": "Take must not exceed 1000",
  }),
}).unknown(false);

export const SearchSchema = Joi.object({
  q: Joi.string().trim().min(2).max(255).required().messages({
    "string.min": "Search query must be at least 2 characters",
    "string.max": "Search query must not exceed 255 characters",
    "any.required": "Search query is required",
  }),
}).unknown(false);
