import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ error, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center text-xl text-red-500">
      <p>{t(error)}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300 transform hover:scale-105 active:scale-95"
      >
        {t('retry')}
      </button>
    </div>
  );
};

export default ErrorMessage;
