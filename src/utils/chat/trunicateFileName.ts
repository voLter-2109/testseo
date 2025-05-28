/**
 * @description укорачивает название файла
 */

const truncateFileName = (fileName: string): string | undefined => {
  if (fileName) {
    let truncatedName = fileName.replace('chat_files/', '');
    if (truncatedName.length > 30) {
      truncatedName = truncatedName.replace(/_/g, ' ');
      let wordsArr = Array.from(truncatedName.split(' '));
      truncatedName = `${wordsArr[0]}...${wordsArr[wordsArr.length - 1]}`;
      if (truncatedName.length > 30) {
        wordsArr = Array.from(truncatedName.split('...'));
        const format = Array.from(wordsArr[wordsArr.length - 1].split('.'));
        truncatedName = `${wordsArr[0]}...${format[format.length - 2].slice(
          -5
        )}.${format[format.length - 1]}`;
      }
    }
    return truncatedName;
  }

  return undefined;
};

export default truncateFileName;
