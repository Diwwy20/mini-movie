import { useEffect, useState } from "react";

const PaymentModal = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 วินาที = 1 นาที

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">ชำระเงิน</h2>

        <div className="mb-6">
          <p className="mb-4">กรุณาโอนเงินมาที่บัญชีธนาคารต่อไปนี้:</p>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-medium">ธนาคารกสิกรไทย</p>
            <p>ชื่อบัญชี: บริษัท มูวีฮับ จำกัด</p>
            <p>เลขที่บัญชี: 123-4-56789-0</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">กรุณาชำระเงินภายใน</p>
          <div className="text-3xl font-bold text-primary">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-light hover:bg-primary text-white rounded-md"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
