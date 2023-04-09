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

export function getImageNameFromUrl(url: string) {
  const urlObject = new URL(url);
  const pathSegments = urlObject.pathname.split('/');
  const imageName = pathSegments[pathSegments.length - 1];

  return imageName;
}

export function getImagePathFromUrl(url: string) {
  const urlObject = new URL(url);
  const pathSegments = urlObject.pathname.split('/');
  pathSegments.shift(); // Remove the empty first element
  pathSegments.shift(); // Remove the 'NutriboxCDN' segment
  pathSegments.pop(); // Remove the last element (image file name)

  return pathSegments.join('/');
}
