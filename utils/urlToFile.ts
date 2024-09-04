import axios from 'axios';

const urlToFile = async (url: string, filename: string) => {
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = response.data;
    const filenameWithExtension = filename.includes('.') ? filename : `${filename}.${url.split('.').pop()}`;
    return new File([blob], filenameWithExtension, { type: blob.type });
  } catch (error) {
    return null;
  }
};

export default urlToFile;
