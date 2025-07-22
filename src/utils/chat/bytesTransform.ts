const bytesTransform = (bytes: number): string => {
  switch (true) {
    case bytes < 1024:
      return `${bytes} B`;
    case bytes < 1048576:
      return `${(bytes / 1024).toFixed(2)} KB`;
    default:
      return `${(bytes / 1048576).toFixed(2)} MB`;
  }
};

export default bytesTransform;
