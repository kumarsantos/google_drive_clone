'use client';
import { Models } from 'node-appwrite';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import DotIcon from '@/public/assets/icons/dots.svg';
import { actionDropdownItems } from '@/constants';
import { ActionType } from '@/types';
import Link from 'next/link';
import { constructDownloadUrl } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import LoaderIcon from '@/public/assets/icons/loader.svg';
import {
    deleteFile,
    renameFile,
    updateFileUsers
} from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { DeleteFile, FileDetails, ShareInput } from './ActionsModalContent';

const ActionDropDown = ({
    file,
    currentUser
}: {
    file: Models.Document;
    currentUser: Models.Document;
}) => {
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(
        null
    );
    const [fileName, setFileName] = useState(file.name);
    const [isLoading, setIsLoading] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);

    const path = usePathname();
    const isOwner = file?.owner?.$id === currentUser?.$id;

    // HANDLE ALL THE ACTIONS
    const handleSubmit = async () => {
        if (!selectedAction) return;
        setIsLoading(true);
        let success = false;
        try {
            const actions = {
                // RENAME FILE
                rename: () =>
                    renameFile({
                        fileId: file.$id,
                        name: fileName,
                        extension: file.extension,
                        path
                    }),
                // SHARE FILE TO OTHER USERS
                share: () =>
                    updateFileUsers({
                        fileId: file.$id,
                        emails,
                        path
                    }),
                // DELETE FILE
                delete: () =>
                    deleteFile({
                        fileId: file.$id,
                        path,
                        bucketFileId: file.bucketFileId
                    })
            };
            // BASED ON THE SELECTED ACTION, THE SERVER ACTION IS GETTING TRIGGERED
            success =
                await actions[selectedAction.value as keyof typeof actions]();
            if (success) {
                closeAllModals();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // CLOSE ALL MODELS
    const closeAllModals = () => {
        setIsModelOpen(false);
        setIsDropDownOpen(false);
        setSelectedAction(null);
        setFileName(file.name);
        setEmails([]);
    };

    //REMOVE USER FROM SHARED LIST
    const handleRemoveUser = async (email: string) => {
        const updatedEmails = emails.filter((e) => e !== email);
        const success = await updateFileUsers({
            fileId: file.$id,
            emails: updatedEmails,
            path
        });
        if (success) {
            setEmails(updatedEmails);
        }
        closeAllModals();
    };

    const renderDialogContent = () => {
        if (!selectedAction) return null;
        const { value, label } = selectedAction;

        return (
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">
                        {label}{' '}
                    </DialogTitle>
                    {value === 'rename' && (
                        <Input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                    )}
                    {value === 'details' && <FileDetails file={file} />}
                    {value === 'share' && (
                        <ShareInput
                            file={file}
                            onInputChange={setEmails}
                            onRemove={handleRemoveUser}
                        />
                    )}
                    {value === 'delete' && <DeleteFile file={file} />}
                </DialogHeader>
                {['rename', 'delete', 'share'].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button
                            onClick={closeAllModals}
                            className="modal-cancel-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading || !isOwner}
                            onClick={handleSubmit}
                            className="modal-submit-button"
                        >
                            <p className="capitalize">Submit</p>
                            {isLoading && (
                                <Image
                                    src={LoaderIcon}
                                    alt="loaderIcon"
                                    height={24}
                                    width={24}
                                    className="ml-2 animate-spin"
                                />
                            )}{' '}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        );
    };

    const handleDropDownMenu = (actionItem: ActionType) => {
        setSelectedAction(actionItem);
        const ACTION_LIST = ['rename', 'delete', 'share', 'details'];
        if (ACTION_LIST.includes(actionItem.value)) {
            setIsModelOpen(true);
        }
    };

    return (
        <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
            <DropdownMenu
                open={isDropDownOpen}
                onOpenChange={setIsDropDownOpen}
            >
                <DropdownMenuTrigger className="shad-no-focus">
                    <Image src={DotIcon} alt="dots" width={34} height={34} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">
                        {file?.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionDropdownItems?.map((actionItem) => (
                        <DropdownMenuItem
                            key={actionItem.value}
                            className="shad-dropdown-item"
                            onClick={() => handleDropDownMenu(actionItem)}
                        >
                            {actionItem.value === 'download' ? (
                                <Link
                                    href={constructDownloadUrl(
                                        file.bucketFileId
                                    )}
                                    download={file.name}
                                    className="flex items-center gap-2"
                                >
                                    <Image
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        height={30}
                                        width={30}
                                    />
                                    {actionItem?.label}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={actionItem.icon}
                                        alt={actionItem.label}
                                        height={30}
                                        width={30}
                                    />
                                    {actionItem?.label}
                                </div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogContent()}
        </Dialog>
    );
};

export default ActionDropDown;
