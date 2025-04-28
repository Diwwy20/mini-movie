const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md bg-black ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-primary-light text-white hover:bg-black/50 cursor-pointer"
          }`}
        >
          ก่อนหน้า
        </button>

        <span className="px-4 py-2 bg-white border rounded-md">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md bg-black ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-primary-light text-white hover:bg-black/50 cursor-pointer"
          }`}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default Pagination;
