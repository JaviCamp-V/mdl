'use client';

import axios from 'axios';

const urlToFile = async (url: string | null | undefined) => {
  if (!url) return null;

  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = response.data;
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    return null;
  }
};

export default urlToFile;
