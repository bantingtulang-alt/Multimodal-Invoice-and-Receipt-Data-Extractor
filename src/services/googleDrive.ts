/**
 * Google Drive Integration Service for DocuFinance AI
 * Uses Google Drive v3 REST API with Bearer token authentication.
 */

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  size?: string;
}

export const ARCHIVE_FOLDER_NAME = 'DocuFinance AI Archive';

/**
 * Searches for or creates a dedicated folder in Google Drive for archived scans and reports.
 */
export async function getOrCreateArchiveFolder(accessToken: string): Promise<string> {
  const cachedFolderId = localStorage.getItem('docufinance_drive_folder_id');
  if (cachedFolderId) {
    try {
      const checkRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${cachedFolderId}?fields=id,trashed`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (!checkData.trashed) {
          return cachedFolderId;
        }
      }
    } catch {
      // Continue to search or create
    }
  }

  // Search if folder already exists
  const query = `name = '${ARCHIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      const folderId = searchData.files[0].id;
      localStorage.setItem('docufinance_drive_folder_id', folderId);
      return folderId;
    }
  }

  // Create new folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: ARCHIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder arsip otomatis faktur, nota, dan laporan DocuFinance AI',
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err.error?.message || 'Gagal membuat folder arsip di Google Drive.');
  }

  const newFolder = await createRes.json();
  localStorage.setItem('docufinance_drive_folder_id', newFolder.id);
  return newFolder.id;
}

/**
 * Lists files from Google Drive (either in the archive folder or user documents).
 */
export async function listDriveFiles(
  accessToken: string,
  options?: {
    inArchiveFolderOnly?: boolean;
    folderId?: string;
    searchTerm?: string;
    filterDocTypes?: boolean;
  }
): Promise<DriveFileItem[]> {
  const queryParts: string[] = ['trashed = false'];

  if (options?.inArchiveFolderOnly && options?.folderId) {
    queryParts.push(`'${options.folderId}' in parents`);
  } else if (options?.filterDocTypes) {
    // Look for images, PDFs, text files or spreadsheets
    queryParts.push(
      "(mimeType contains 'image/' or mimeType = 'application/pdf' or mimeType = 'text/plain' or mimeType = 'application/json' or mimeType = 'application/vnd.google-apps.spreadsheet')"
    );
  }

  if (options?.searchTerm?.trim()) {
    queryParts.push(`name contains '${options.searchTerm.trim().replace(/'/g, "\\'")}'`);
  }

  const q = queryParts.join(' and ');
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    q
  )}&fields=files(id,name,mimeType,iconLink,webViewLink,thumbnailLink,createdTime,size)&orderBy=createdTime desc&pageSize=50`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Gagal memuat berkas dari Google Drive.');
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Uploads structured JSON document or report to Google Drive
 */
export async function uploadJsonToDrive(
  accessToken: string,
  fileName: string,
  jsonContent: object,
  folderId?: string
): Promise<DriveFileItem> {
  const metadata: any = {
    name: fileName,
    mimeType: 'application/json',
  };
  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(jsonContent, null, 2) +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Gagal mengunggah berkas JSON ke Google Drive.');
  }

  return await res.json();
}

/**
 * Uploads image/receipt file directly to Google Drive
 */
export async function uploadImageToDrive(
  accessToken: string,
  fileName: string,
  imageBase64: string,
  mimeType: string = 'image/png',
  folderId?: string
): Promise<DriveFileItem> {
  // Extract pure base64
  const pureBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '').replace(/[\r\n\s]/g, '');
  
  // Convert base64 to byte blob
  const byteCharacters = atob(pureBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  const metadata: any = {
    name: fileName,
    mimeType,
  };
  if (folderId) {
    metadata.parents = [folderId];
  }

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Gagal mengunggah berkas gambar ke Google Drive.');
  }

  return await res.json();
}

/**
 * Downloads a document from Google Drive and prepares it for analysis in DocuFinance AI.
 */
export async function downloadDriveFileForAnalysis(
  accessToken: string,
  fileId: string,
  fileName: string,
  mimeType: string
): Promise<{
  title: string;
  imageBase64?: string;
  mimeType?: string;
  rawText?: string;
}> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error('Gagal mengunduh berkas dari Google Drive.');
  }

  if (mimeType.startsWith('image/')) {
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          title: fileName,
          imageBase64: reader.result as string,
          mimeType: blob.type || mimeType,
        });
      };
      reader.onerror = () => reject(new Error('Gagal membaca gambar dari Google Drive.'));
      reader.readAsDataURL(blob);
    });
  } else if (mimeType === 'application/pdf') {
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          title: fileName,
          imageBase64: reader.result as string,
          mimeType: 'application/pdf',
        });
      };
      reader.onerror = () => reject(new Error('Gagal membaca PDF dari Google Drive.'));
      reader.readAsDataURL(blob);
    });
  } else {
    // Text or JSON
    const text = await res.text();
    return {
      title: fileName,
      rawText: text,
      mimeType: 'text/plain',
    };
  }
}

/**
 * Deletes a file from Google Drive (Must be preceded by user confirmation dialog).
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<boolean> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Gagal menghapus berkas dari Google Drive.');
  }

  return true;
}
