const LoadingIndicator = ({ message = "กำลังโหลด..." }) => {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="text-xl">{message}</div>
    </div>
  );
};

export default LoadingIndicator;
