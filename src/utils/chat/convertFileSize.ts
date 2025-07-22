const convertFileSize = (fileSize: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (fileSize === 0) return '0 B';
  const i = Math.floor(Math.log(fileSize) / Math.log(1024));
  return `${(fileSize / 1024 ** i).toFixed(2)} ${sizes[i]}`;
};

export default convertFileSize;
