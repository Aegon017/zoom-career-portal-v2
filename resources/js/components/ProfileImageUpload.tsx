import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';


import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';

import { useState } from 'react';
import { on } from 'events';

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
);

interface Props {
    initialImageUrl?: string;
    uploadUrl: string;
    removeUrl: string;
    onUploaded: (url: string) => void;
}

const ProfileImageUpload: React.FC<Props> = ({ initialImageUrl, uploadUrl, removeUrl, onUploaded }) => {
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
                    }
                },
                revert: (uniqueFileId: string) => {
                    fetch(removeUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ fileUrl: uniqueFileId }),
                    })
                        .then(() => {
                            onUploaded?.('');
                            setFiles([]);
                        })
                }
            }}
            acceptedFileTypes={['image/*']}
            name="file"
            labelIdle='Drag & Drop your profile image or <span class="filepond--label-action">Browse</span>'
        />
    );
};

export default ProfileImageUpload;
