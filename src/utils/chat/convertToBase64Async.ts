async function convertToBase64Async(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (reader.result) {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error(`Ошибка конвертации файла ${file.name}`));
      }
    };

    reader.onerror = (error) => {
      reject(new Error(`${error}`));
    };
  });
}

export default convertToBase64Async;
