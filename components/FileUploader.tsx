'use client';
import React, { MouseEvent, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import UploadIcon from '@/public/assets/icons/upload.svg';
import Thumbnail from './Thumbnail';
import FileLoader from '@/public/assets/icons/file-loader.gif';
import RemoveIcon from '@/public/assets/icons/remove.svg';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { MAX_FILE_SIZE } from '@/constants';
import { UploadFileProps } from '@/types';

const FileUploader = ({ ownerId, accountId, className }: UploadFileProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const { toast } = useToast();
    const path = usePathname();

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setFiles(acceptedFiles);

            const uploadPromises = acceptedFiles?.map(async (file) => {
                if (file.size > MAX_FILE_SIZE) {
                    setFiles((prev) =>
                        prev.filter((f) => f.name !== file.name)
                    );
                    return toast({
                        description: (
                            <p className="body-2 text-white">
                                <span className="font-semibold">
                                    {file.name}
                                </span>{' '}
                                is too large. Max file size is 50MB.
                            </p>
                        ),
                        className: 'error-toast'
                    });
                }

                return uploadFile({
                    file,
                    ownerId,
                    accountId,
                    path
                }).then((uploadedFile) => {
                    if (uploadedFile) {
                        setFiles((prev) =>
                            prev.filter((f) => f.name !== file.name)
                        );
                    }
                    toast({
                        description: (
                            <p className="body-2  text-green">
                                File uploaded successfully
                            </p>
                        )
                    });
                });
            });
            await Promise.all(uploadPromises);
        },
        [ownerId, accountId, path, toast]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop
    });

    const handleRemove = (
        e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>,
        filename: string
    ) => {
        e.stopPropagation();
        setFiles((prev) => prev.filter((item) => item.name !== filename));
    };

    return (
        <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <Button type="button" className={cn('uploader-button', className)}>
                <Image src={UploadIcon} alt="upload" height={24} width={24} />
                <p>Upload Files</p>
            </Button>
            {files.length > 0 && (
                <ul className="uploader-preview-list">
                    <h4 className="h4 text-light-100">Uploading</h4>
                    {files.map((file, index) => {
                        const { type, extension } = getFileType(file.name);
                        return (
                            <li
                                key={`${file.name}=${index}`}
                                className="uploader-preview-item"
                            >
                                <div className="flex items-center gap-3">
                                    <Thumbnail
                                        type={type}
                                        extension={extension}
                                        url={convertFileToUrl(file)}
                                    />
                                    <div className="preview-item-name">
                                        {file.name}
                                        <Image
                                            src={FileLoader}
                                            alt="file-loader"
                                            width={80}
                                            height={26}
                                        />
                                    </div>
                                </div>
                                <Image
                                    src={RemoveIcon}
                                    alt="remove"
                                    width={24}
                                    height={24}
                                    onClick={(e) => handleRemove(e, file.name)}
                                />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FileUploader;
