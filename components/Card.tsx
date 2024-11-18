import Link from 'next/link';
import { Models } from 'node-appwrite';
import React from 'react';
import Thumbnail from './Thumbnail';
import { convertFileSize } from '@/lib/utils';
import FormattedDateTime from './FormattedDateTime';
import ActionDropDown from './ActionDropDown';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const Card = async ({ file }: { file: Models.Document }) => {
    const currentUser = await getCurrentUser();
    if(!currentUser){
        redirect('/sign-in')
    }
    return (
        <Link href={file.url} target="_blank" className="file-card">
            <div className="flex justify-between">
                <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                    className="!size-20" // important class
                    imageClassName="!size-11" // important class
                />
                <div className="flex flex-col items-end justify-between">
                    <ActionDropDown file={file} currentUser={currentUser} />
                    <p className="body-1">{convertFileSize(file.size)}</p>
                </div>
            </div>
            <div className="file-card-details">
                <p className="subtitle-2 line-clamp-1">{file.name}</p>
                <FormattedDateTime
                    date={file?.$createdAt}
                    className="body-2 text-light-100"
                />
                <p className="caption line-clamp-1 text-light-200">
                    {file?.owner?.fullName}
                </p>
            </div>
        </Link>
    );
};

export default Card;
