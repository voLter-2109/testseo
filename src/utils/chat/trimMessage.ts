//* функция используется при отправке текстового сообщения, что бы удалить лишние символы
const trimMessage = (text: string) => {
  let trimmedMessage = text.replace(
    /^((<p><\/p>)*(<p>(<br>*|\s*)<\/p>)*)*/,
    ''
  );
  trimmedMessage = trimmedMessage.replace(
    /((<p><\/p>)*(<p>(<br>*|\s*)<\/p>)*)*$/,
    ''
  );
  trimmedMessage = trimmedMessage.replace(/^(<p>\s+)/, '<p>');
  trimmedMessage = trimmedMessage.replace(/(\s+<\/p>)$/, '</p>');
  return trimmedMessage;
};

export default trimMessage;
