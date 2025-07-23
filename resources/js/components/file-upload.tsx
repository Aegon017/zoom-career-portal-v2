import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';

import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import axios from 'axios';
import { useState } from 'react';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

interface Props {
    placeholder: string;
    name: string;
    onUploaded: (tempPath: string) => void;
    acceptedFileTypes: string[];
}

const FileUpload: React.FC<Props> = ({ placeholder, name, onUploaded, acceptedFileTypes }) => {
    const [files, setFiles] = useState<any[]>([]);

    return (
        <FilePond
            name={name}
            files={files}
            allowMultiple={false}
            onupdatefiles={setFiles}
            acceptedFileTypes={acceptedFileTypes}
            labelIdle={placeholder}
            maxFileSize="1MB"
            allowFileSizeValidation={true}
            server={{
                process: {
                    url: '/temp-upload',
                    method: 'POST',
                    withCredentials: false,
                    headers: {
                        Accept: 'application/json',
                    },
                    onload: (res: string) => {
                        const { temp_path } = JSON.parse(res);
                        onUploaded(temp_path);
                        return temp_path;
                    },
                },
                revert: (uniqueFileId: string, load, error) => {
                    axios
                        .post('/temp-upload/remove', { fileUrl: uniqueFileId })
                        .then(() => {
                            setFiles([]);
                            onUploaded?.('');
                            load();
                        })
                        .catch(() => {
                            error('Failed to delete image');
                        });
                },
            }}
        />
    );
};

export default FileUpload;