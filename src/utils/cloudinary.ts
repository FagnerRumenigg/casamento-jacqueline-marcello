interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
}

interface UploadCardOptions {
  guestName?: string;
  messagePreview?: string;
  tags?: string[];
}

function getCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const cardsTag = import.meta.env.VITE_CLOUDINARY_CARDS_TAG?.trim();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
  const folder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary não configurado. Defina VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET.',
    );
  }

  return { cloudName, cardsTag, uploadPreset, folder };
}

export async function uploadCardToCloudinary(
  file: Blob,
  fileName: string,
  options: UploadCardOptions = {},
): Promise<CloudinaryUploadResult> {
  const { cloudName, cardsTag, uploadPreset, folder } = getCloudinaryConfig();
  const formData = new FormData();
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20000);
  const tagSet = new Set<string>();

  formData.append('file', file, fileName);
  formData.append('upload_preset', uploadPreset);
  formData.append('resource_type', 'image');

  if (folder) {
    formData.append('folder', folder);
  }

  if (cardsTag) {
    tagSet.add(cardsTag);
  }

  for (const tag of options.tags ?? []) {
    const normalizedTag = tag.trim();
    if (normalizedTag) {
      tagSet.add(normalizedTag);
    }
  }

  if (tagSet.size > 0) {
    formData.append('tags', Array.from(tagSet).join(','));
  }

  const contextEntries = [
    ['guest_name', options.guestName?.trim() ?? ''],
    ['message_preview', options.messagePreview?.trim() ?? ''],
  ].filter(([, value]) => value.length > 0);

  if (contextEntries.length > 0) {
    formData.append(
      'context',
      contextEntries.map(([key, value]) => `${key}=${value}`).join('|'),
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      },
    );
  } catch (error) {
    window.clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(
        'O envio do cartão demorou mais do que o esperado. Tente novamente.',
      );
    }

    throw error;
  }

  window.clearTimeout(timeoutId);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Falha ao enviar para o Cloudinary (${response.status}): ${errorText}`,
    );
  }

  return (await response.json()) as CloudinaryUploadResult;
}
