'use server';
import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';
import { appWriteConfig } from '../appwrite/config';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { parseStringify } from '../utils';
import { PLACEHOLDER_IMAGE } from '@/constants';

export const getUserByEmail = async (email: string) => {
    try {
        const { database } = await createAdminClient();
        const result = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.usersCollectionId,
            [Query.equal('email', [email])]
        );
        return result.total > 0 ? result.documents[0] : null;
    } catch (error) {
        console.log(error);
    }
};

export const handleError = async (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId;
    } catch (error) {
        handleError(error, 'Failed to send email OTP');
    }
};

export const createAccount = async ({
    fullName,
    email
}: {
    fullName: string;
    email: string;
}) => {
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error('Failed to send an OTP');
    if (!existingUser) {
        const { database } = await createAdminClient();
        await database.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: PLACEHOLDER_IMAGE,
                accountId
            }
        );
    }
    return parseStringify({ accountId });
};

export const verifySecret = async ({
    accountId,
    password
}: {
    accountId: string;
    password: string;
}) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);
        (await cookies()).set('app_write_session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        });
        return parseStringify({ sessionId: session.$id });
    } catch (error) {
        await handleError(error, 'Failed to verify OTP');
    }
};

export const getCurrentUser = async () => {
    try {
        const { database, account } = await createSessionClient();
        const result = await account.get();
        const user = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.usersCollectionId,
            [Query.equal('accountId', result.$id)]
        );
        if (user.total <= 0) return null;
        return parseStringify(user.documents[0]);
    } catch (error) {
        console.log(error);
    }
};

export const signOutUser = async () => {
    try {
        const { account } = await createSessionClient();
        await account.deleteSession('current');
        (await cookies()).delete('app_write_session');
    } catch (error) {
        await handleError(error, 'Failed to sign out user');
    } finally {
        redirect('/sign-in');
    }
};

export const signInUser = async ({ email }: { email: string }) => {
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            await sendEmailOTP({ email });
            return parseStringify({ accountId: existingUser.accountId });
        }
        return parseStringify({ accountId: null, error: 'User not found' });
    } catch (error) {
        await handleError(error, 'Failed to sign in user');
    }
};
