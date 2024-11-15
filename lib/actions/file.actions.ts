'use server';

import { UploadFileProps } from '@/types';
import { createAdminClient } from '../appwrite';
import { handleError } from './user.actions';
import { InputFile } from 'node-appwrite/file';
import { appWriteConfig } from '../appwrite/config';
import { ID } from 'node-appwrite';
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
