const ErrorMessage = ({ error, onRetry }) => (
    <div className="text-center text-xl text-red-500">
      <p>{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300 transform hover:scale-105 active:scale-95"
      >
        Réessayer
      </button>
    </div>
  );
  
  export default ErrorMessage;
  