import toast from 'react-hot-toast';

const useNotifyToast = ({
  duration = 1200,
  text,
  type,
}: {
  type: 'success' | 'error';
  text: string;
  duration?: number;
}) => {
  if (type === 'success') {
    return toast.success(text, {
      duration,
      style: {
        minWidth: '350px',
      },
    });
  }
  if (type === 'error') {
    return toast.error(text, {
      duration,
      style: {
        minWidth: '350px',
      },
    });
  }
  return null;
};

export default useNotifyToast;
