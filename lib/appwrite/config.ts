export const appWriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APP_WRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APP_WRITE_PROJECT!,
    databaseId: process.env.NEXT_PUBLIC_APP_WRITE_DATABASE!,
    usersCollectionId: process.env.NEXT_PUBLIC_APP_WRITE_USERS_COLLECTION!,
    filesCollectionId: process.env.NEXT_PUBLIC_APP_WRITE_FILES_COLLECTION!,
    bucketId: process.env.NEXT_PUBLIC_APP_WRITE_BUCKET!,
    secretKey:process.env.NEXT_APP_WRITE_KEY!
};
