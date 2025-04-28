import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

import { imageUrl } from "@/services/api";
import { Trash2 } from "lucide-react";
import AlertDialogComponent from "../alert/AlertDialogComponent";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalPrice,
    discount,
    finalPrice,
  } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    if (isPopupOpen && remainingTime > 0 && !isOrderConfirmed) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);

            if (!isOrderConfirmed) {
              setIsTimedOut(true);
              setIsPopupOpen(false);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPopupOpen, remainingTime, isOrderConfirmed]);

  useEffect(() => {
    if (isPopupOpen) {
      setRemainingTime(60);
      setIsTimedOut(false);
    }
  }, [isPopupOpen]);

  const handleCheckout = () => {
    setIsPopupOpen(true);
    navigate;
  };

  const handleOrderConfirmation = () => {
    setIsOrderConfirmed(true);
    setIsPopupOpen(false);

    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const clearAllCart = () => {
    clearCart();
    toast.success(t("All Items Removed from Cart"));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("Shopping Cart")}</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">{t("Empty Cart")} ...</p>
        </div>
      ) : (
        <>
          {/* รายการสินค้าต่างๆ */}
          <div className="grid gap-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                {item.poster_path ? (
                  <img
                    src={imageUrl(item.poster_path, "w92")}
                    alt={item.title}
                    className="w-16 h-24 object-cover rounded mr-4"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-200 rounded mr-4 flex items-center justify-center text-center text-xs text-gray-500 p-1">
                    {t("No Poster")}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold">
                    {formatCurrency(item.price)} {t("THB (Baht)")}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* สรุปยอดเงิน */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span>{t("Total")}:</span>
              <span className="font-bold">
                {formatCurrency(totalPrice)} {t("THB (Baht)")}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>{t("Discount")}:</span>
                <span className="font-bold">
                  -{formatCurrency(discount)} {t("THB (Baht)")}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>{t("Amount Due")}:</span>
              <span>
                {formatCurrency(finalPrice)} {t("THB (Baht)")}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => clearAllCart()}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium cursor-pointer"
            >
              {t("Clear Cart")}
            </button>
            <button
              onClick={handleCheckout}
              className="px-6 py-2 bg-black hover:bg-black/50 text-white rounded-md font-medium cursor-pointer"
            >
              {t("Checkout")}
            </button>
          </div>
        </>
      )}

      {/* ----- Popup สำหรับการโอนเงิน ----- */}
      {isPopupOpen && (
        <AlertDialogComponent
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          remainingTime={remainingTime}
          handleOrderConfirmation={handleOrderConfirmation}
        />
      )}

      {/* ----- หากยืนยันการสั่งซื้อแล้ว ----- */}
      {isOrderConfirmed && (
        <AlertDialogComponent
          isPopupOpen={isOrderConfirmed}
          setIsPopupOpen={setIsOrderConfirmed}
          orderConfirmed={true}
        />
      )}

      {/* ----- แสดงแจ้งเตือนหากหมดเวลา ----- */}
      {isTimedOut && (
        <AlertDialog open={isTimedOut} onOpenChange={setIsTimedOut}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("Payment Time Expired")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  "Payment time has expired. Your order has been canceled. Please make a new order"
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <button onClick={() => setIsTimedOut(false)}>{t("OK")}</button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Cart;
