import ImageKit from 'imagekit';

export const getImageKitInstance = () =>
  new ImageKit({
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT_URL,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  });

export async function deleteFileById(fileId: string) {
  const imagekit = getImageKitInstance();
  return await imagekit.deleteFile(fileId);
}

export function getImageNameFromUrl(imageUrl: string) {
  const urlParts = imageUrl.split('/');
  const temp = urlParts[urlParts.length - 1];
  return temp.substring(0, temp.indexOf('?updatedAt'));
}
