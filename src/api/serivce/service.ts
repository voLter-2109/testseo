import { CreatedSupportMessage } from '../../types/service/service';
import { apiWithAuth } from '../api';

/**
 * @name askSupportService
 * @description создание нового текстового сообщения
 * @prop {string} userId
 * @prop {object} data: example type CreatedTextMessage
 * @returns {object} example type RequestTextMessage
 */
const askSupportService = ({ text, email }: CreatedSupportMessage) =>
  apiWithAuth.post(`/service/message/`, {
    email,
    text,
  });

export default askSupportService;
