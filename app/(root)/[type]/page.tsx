import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles } from '@/lib/actions/file.actions';
import { getFileTypesParams, getTotalFileSize } from '@/lib/utils';
import { FileType, SearchParamProps } from '@/types';
import { Models } from 'node-appwrite';
import React from 'react';

const Page = async ({ searchParams, params }: SearchParamProps) => {
    const type = ((await params)?.type as string) || '';
    const types = getFileTypesParams(type) as FileType[];

    const searchText = ((await searchParams)?.query as string) || '';
    const sort = ((await searchParams)?.sort as string) || '';

    const files = await getFiles({ types, searchText, sort });
    const totalFileSize = getTotalFileSize(files.documents);

    return (
        <div className="page-container">
            <section className="w-full">
                <h1 className="h1 capitalize">{type}</h1>
                <div className="total-size-section">
                    <p className="body-1">
                        Total: <span className="h5">{totalFileSize}</span>
                    </p>
                    <div className="sort-container">
                        <p className="body-1 hidden text-light-200 sm:block">
                            Sort by:
                        </p>
                        <Sort />
                    </div>
                </div>
            </section>
            {files?.total > 0 ? (
                <section className="file-list">
                    {files.documents.map((file: Models.Document) => {
                        return <Card key={file.$id} file={file} />;
                    })}
                </section>
            ) : (
                <p>No File Uploaded</p>
            )}
        </div>
    );
};

export default Page;
