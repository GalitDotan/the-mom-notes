export type UploadedFile = {
    /** A data: URL holding the whole file, stored with the note in localStorage. */
    file_url: string;
    original_name: string;
    size: number;
    mime_type: string;
};

/**
 * "Uploads" a file by reading it into a data: URL. Nothing leaves the browser;
 * the result is stored alongside the note.
 */
export async function UploadFile({ file }: { file: File }): Promise<UploadedFile> {
    if (!file) {
        throw new Error('No file provided to upload');
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error(`Could not read ${file.name} as a data URL`));
            }
        };
        reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}`));
        reader.readAsDataURL(file);
    });

    return {
        file_url: dataUrl,
        original_name: file.name,
        size: file.size,
        mime_type: file.type,
    };
}
