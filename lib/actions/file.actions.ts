'use server';

import {
    DeleteFileProps,
    FileType,
    GetFilesProps,
    RenameFileProps,
    UpdateFileUsersProps,
    UploadFileProps
} from '@/types';
import { createAdminClient } from '../appwrite';
import { getCurrentUser, handleError } from './user.actions';
import { InputFile } from 'node-appwrite/file';
import { appWriteConfig } from '../appwrite/config';
import { ID, Models, Query } from 'node-appwrite';
import { constructFileUrl, getFileType, parseStringify } from '../utils';
import { revalidatePath } from 'next/cache';

export const uploadFile = async ({
    file,
    ownerId,
    accountId,
    path
}: UploadFileProps) => {
    const { storage, database } = await createAdminClient();
    try {
        const inputFile = InputFile.fromBuffer(file, file.name);
        const bucketFile = await storage.createFile(
            appWriteConfig.bucketId,
            ID.unique(),
            inputFile
        );
        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id
        };

        const newFile = await database
            .createDocument(
                appWriteConfig.databaseId,
                appWriteConfig.filesCollectionId,
                ID.unique(),
                fileDocument
            )
            .catch(async (error: unknown) => {
                await storage.deleteFile(
                    appWriteConfig.bucketId,
                    bucketFile.$id
                );
                await handleError(error, 'Failed to create file document');
            });
        revalidatePath(path);
        return parseStringify(newFile);
    } catch (error) {
        await handleError(error, 'File to upload failed');
    }
};

const createQueries = (currentUser: Models.Document, types: string[]) => {
    const queries = [
        Query.or([
            Query.equal('owner', [currentUser.$id]),
            Query.contains('users', [currentUser.email])
        ])
    ];
    //adding filter based on the types
    if (types.length > 0) {
        queries.push(Query.equal('type', types));
    }
    ///TODO Search,sort,limits
    return queries;
};

export const getFiles = async ({ types = [] }: GetFilesProps) => {
    const { database } = await createAdminClient();
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error('User not found');
        }
        const queries = createQueries(currentUser, types);
        const files = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.filesCollectionId,
            queries
        );
        return parseStringify(files);
    } catch (error) {
        await handleError(error, 'Failed to fetch files');
    }
};

export const renameFile = async ({
    fileId,
    name,
    extension,
    path
}: RenameFileProps) => {
    const { database } = await createAdminClient();
    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await database.updateDocument(
            appWriteConfig.databaseId,
            appWriteConfig.filesCollectionId,
            fileId,
            {
                name: newName
            }
        );
        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        await handleError(error, 'Failed to rename the file');
    }
};

export const updateFileUsers = async ({
    fileId,
    emails,
    path
}: UpdateFileUsersProps) => {
    const { database } = await createAdminClient();
    try {
        const updatedFile = await database.updateDocument(
            appWriteConfig.databaseId,
            appWriteConfig.filesCollectionId,
            fileId,
            {
                users: emails
            }
        );
        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        await handleError(error, 'Failed to rename the file');
    }
};
export const deleteFile = async ({
    fileId,
    path,
    bucketFileId
}: DeleteFileProps) => {
    const { database, storage } = await createAdminClient();
    try {
        const deletedFile = await database.deleteDocument(
            appWriteConfig.databaseId,
            appWriteConfig.filesCollectionId,
            fileId
        );
        if (deletedFile) {
            await storage.deleteFile(appWriteConfig.bucketId, bucketFileId);
        }

        revalidatePath(path);
        return parseStringify({ success: true });
    } catch (error) {
        await handleError(error, 'Failed to delete the file');
    }
};
