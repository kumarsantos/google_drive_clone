import Link from 'next/link';
import { Models } from 'node-appwrite';
import React from 'react';
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import ActionDropDown from './ActionDropDown';
import { getCurrentUser } from '@/lib/actions/user.actions';

const RecentUploadedFiles = async ({
    files: { documents }
}: {
    files: { documents: Models.Document };
}) => {
    const currentUser = await getCurrentUser();
    return (
        <section className="dashboard-recent-files">
            <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
            {documents?.length > 0 ? (
                <ul className="mt-5 flex flex-col gap-5">
                    {documents?.map((file: Models.Document) => (
                        <Link
                            href={file.url}
                            target="_blank"
                            className="flex items-center gap-3"
                            key={file.$id}
                        >
                            <Thumbnail
                                type={file.type}
                                extension={file.extension}
                                url={file.url}
                            />

                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col gap-1">
                                    <p className="recent-file-name">
                                        {file.name}
                                    </p>
                                    <FormattedDateTime
                                        date={file.$createdAt}
                                        className="caption"
                                    />
                                </div>
                                <ActionDropDown
                                    file={file}
                                    currentUser={currentUser}
                                />
                            </div>
                        </Link>
                    ))}
                </ul>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </section>
    );
};

export default RecentUploadedFiles;
