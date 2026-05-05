/**
 * @param {{ file: File }} param0
 */
export async function UploadFile({ file }) {
    if (!file) {
        throw new Error('No file provided to upload');
    }

    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    return {
        file_url: dataUrl,
        original_name: file.name,
        size: file.size,
        mime_type: file.type,
    };
}
