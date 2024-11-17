import { Models } from 'node-appwrite';
import React from 'react';

const RecentUploadedFiles = ({ files }: { files: Models.Database[] }) => {
    console.log({ files });
    return <div>RecentUploadedFiles</div>;
};

export default RecentUploadedFiles;
