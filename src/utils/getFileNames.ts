const getFileName = (str: string) => {
  const decodeName = decodeURI(str);
  const fullName = decodeName.split('/')[decodeName.split('/').length - 1];
  const extInx = fullName.indexOf('.');
  const ext = fullName.slice(extInx);
  const pureName = fullName.slice(0, extInx).split('_')[0];
  return `${pureName.slice(0, 15)}${ext}`;
};

export default getFileName;
