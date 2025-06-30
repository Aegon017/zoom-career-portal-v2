import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import { useState } from 'react';
import axios from 'axios';

registerPlugin( FilePondPluginImagePreview, FilePondPluginFileValidateType );

interface Props {
    placeholder: string;
    name: string;
    onUploaded: ( tempPath: string ) => void;
    acceptedFileTypes: string[];
}

const FileUpload: React.FC<Props> = ( { placeholder, name, onUploaded, acceptedFileTypes } ) => {
    const [ files, setFiles ] = useState<any[]>( [] );

    return (
        <FilePond
            name={ name }
            files={ files }
            allowMultiple={ false }
            onupdatefiles={ setFiles }
            acceptedFileTypes={ acceptedFileTypes }
            labelIdle={ placeholder }
            server={ {
                process: {
                    url: '/temp-upload',
                    method: 'POST',
                    withCredentials: false,
                    headers: {
                        Accept: 'application/json',
                    },
                    onload: ( res: string ) => {
                        const { temp_path } = JSON.parse( res );
                        onUploaded( temp_path );
                        return temp_path;
                    },
                },
                revert: ( uniqueFileId: string, load, error ) => {
                    axios.post( '/temp-upload/remove', { fileUrl: uniqueFileId } )
                        .then( () => {
                            setFiles( [] );
                            onUploaded?.( '' );
                            load();
                        } )
                        .catch( () => {
                            error( 'Failed to delete image' );
                        } );
                },
            } }
        />
    );
};

export default FileUpload;