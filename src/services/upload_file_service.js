import { Platform } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';

export const photoUploader = async () => {
  const files = await ImagePicker.launchImageLibrary({ selectionLimit: 1, mediaType: 'photo' });
  if (!files.didCancel) {
    let images = []
    files.assets.map(file => {
      return images.push({
        path: file.uri.replace('file://', ''),
        name: file.fileName,
        size: file.fileSize,
      })
    });

    return {
      files,
      images
    }
  }

  return {
    files: null,
    images: null
  }
}

async function copyVideo(uri, fileName) {
  const destPath = `${RNFS.TemporaryDirectoryPath}/temp_${fileName}.mp4`;
  await RNFS.copyFile(uri, destPath).catch((err) => console.log(err));
  const a = await RNFS.stat(destPath);
  return destPath;
}

export const videoUploader = async () => {
  const files = await ImagePicker.launchImageLibrary({ selectionLimit: 1, mediaType: 'video' });
  if (!files.didCancel) {
    let path = files.assets[0].uri

    if (path.startsWith('content://') || path.startsWith('file://')) path = await copyVideo(path, files.assets[0].fileName);

    let videos = []

    files.assets.map(file => {
      return videos.push({
        path: Platform.OS === 'ios' ? file.uri.replace('file://', '') : path,
        name: file.fileName,
        size: file.fileSize,
      })
    });

    return videos
  }
  return null;
}
