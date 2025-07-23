import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import { useState } from 'react';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginImageExifOrientation);

interface Props {
    placeholder: string;
    initialImageUrl?: string;
    uploadUrl: string;
    removeUrl: string;
    onUploaded: (url: string) => void;
}

const ProfileImageUpload: React.FC<Props> = ({ placeholder, initialImageUrl, uploadUrl, removeUrl, onUploaded }) => {
    const [files, setFiles] = useState<any[]>([]);

    return (
        <FilePond
            files={files}
            allowImagePreview={true}
            onupdatefiles={setFiles}
            allowMultiple={false}
            server={{
                process: {
                    url: uploadUrl,
                    method: 'POST',
                    withCredentials: false,
                    onload: (response: string) => {
                        const { url } = JSON.parse(response);
                        onUploaded?.(url);
                        return url;
                    },
                },
                revert: (uniqueFileId: string) => {
                    fetch(removeUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ fileUrl: uniqueFileId }),
                    }).then(() => {
                        onUploaded?.('');
                        setFiles([]);
                    });
                },
            }}
            acceptedFileTypes={['image/*']}
            name="file"
            labelIdle={placeholder}
        />
    );
};

export default ProfileImageUpload;
