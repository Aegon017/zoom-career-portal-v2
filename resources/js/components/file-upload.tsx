import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import axios from 'axios';
import { useState, useEffect } from 'react';

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginFilePoster
);

interface Props {
    placeholder: string;
    name: string;
    onUploaded: ( tempPath: string ) => void;
    acceptedFileTypes: string[];
    defaultValue?: string;
    maxFileSize?: string;
}

const FileUpload: React.FC<Props> = ( {
    placeholder,
    name,
    onUploaded,
    acceptedFileTypes,
    defaultValue,
    maxFileSize = '1MB'
} ) => {
    const [ files, setFiles ] = useState<any[]>( [] );
    const [ isInitializing, setIsInitializing ] = useState( false );

    const getFileSize = async ( url: string ): Promise<number> => {
        try {
            const response = await axios.head( url );
            const contentLength = response.headers[ 'content-length' ];
            return contentLength ? parseInt( contentLength ) : 0;
        } catch ( error ) {
            console.error( 'Error fetching file size:', error );
            return 0;
        }
    };

    const getFileType = ( url: string ): string => {
        const extension = url.split( '.' ).pop()?.toLowerCase() || '';
        const typeMap: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            svg: 'image/svg+xml'
        };
        return typeMap[ extension ] || 'application/octet-stream';
    };

    useEffect( () => {
        const initializeDefaultFile = async () => {
            if ( defaultValue && !isInitializing ) {
                setIsInitializing( true );
                try {
                    const fileType = getFileType( defaultValue );
                    const fileName = defaultValue.split( '/' ).pop() || 'file';

                    const initialFile = {
                        source: defaultValue,
                        options: {
                            type: 'local',
                            file: {
                                name: fileName,
                                type: fileType,
                                size: 0
                            },
                            metadata: {
                                poster: defaultValue
                            }
                        }
                    };

                    setFiles( [ initialFile ] );

                    const size = await getFileSize( defaultValue );
                    setFiles( [ {
                        ...initialFile,
                        options: {
                            ...initialFile.options,
                            file: {
                                ...initialFile.options.file,
                                size: size
                            }
                        }
                    } ] );
                } catch ( error ) {
                    console.error( 'Error initializing default file:', error );
                } finally {
                    setIsInitializing( false );
                }
            }
        };

        initializeDefaultFile();
    }, [ defaultValue ] );

    const handleProcess = ( res: string ) => {
        const { temp_path } = JSON.parse( res );
        onUploaded( temp_path );
        return temp_path;
    };

    const handleRevert = ( uniqueFileId: string, load: () => void, error: ( msg: string ) => void ) => {
        axios
            .post( '/temp-upload/remove', { fileUrl: uniqueFileId } )
            .then( () => {
                setFiles( [] );
                onUploaded( '' );
                load();
            } )
            .catch( () => {
                error( 'Failed to delete image' );
            } );
    };

    return (
        <FilePond
            name={ name }
            files={ files }
            allowMultiple={ false }
            onupdatefiles={ setFiles }
            acceptedFileTypes={ acceptedFileTypes }
            labelIdle={ placeholder }
            maxFileSize={ maxFileSize }
            allowFileSizeValidation={ true }
            allowFilePoster={ true }
            filePosterMaxHeight={ 200 }
            server={ {
                process: {
                    url: '/temp-upload',
                    method: 'POST',
                    withCredentials: false,
                    headers: {
                        Accept: 'application/json',
                    },
                    onload: handleProcess,
                },
                revert: handleRevert,
            } }
        />
    );
};

export default FileUpload;