import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AlertDialogComponent = ({
  isPopupOpen,
  setIsPopupOpen,
  remainingTime,
  handleOrderConfirmation,
  orderConfirmed,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { totalPrice, discount, finalPrice } = useCart();

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const bankInfo = {
    bankName: "ธนาคารกสิกรไทย",
    accountName: "บริษัท มูฟวี่ช็อป จำกัด",
    accountNumber: "xxx-x-xxxxx-x",
    promptpay: "xxx-xxx-xxxx",
  };

  return (
    <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {orderConfirmed
              ? t("Order Completed")
              : t("Please make the payment")}
          </AlertDialogTitle>
          {!orderConfirmed && (
            <div className="text-center text-xl font-bold text-red-500 mb-2">
              {t("Time Remaining")}: {formattedTime}
            </div>
          )}
          <AlertDialogDescription>
            {orderConfirmed ? (
              t("Thank you for your order")
            ) : (
              <div className="space-y-3 mt-2">
                <p>
                  {t("Please transfer the payment to the following account")}:
                </p>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p>
                    <strong>{t("Bank")}:</strong> {bankInfo.bankName}
                  </p>
                  <p>
                    <strong>{t("Account Name")}:</strong> {bankInfo.accountName}
                  </p>
                  <p>
                    <strong>{t("Account Number")}:</strong>{" "}
                    {bankInfo.accountNumber}
                  </p>
                  <p>
                    <strong>{t("PromptPay")}:</strong> {bankInfo.promptpay}
                  </p>

                  {discount > 0 && (
                    <div className="mt-2">
                      <p>
                        <strong>{t("Total")}:</strong>{" "}
                        {formatCurrency(totalPrice)} {t("THB (Baht)")}
                      </p>
                      <p className="text-green-600">
                        <strong>{t("Discount")}:</strong> -
                        {formatCurrency(discount)} {t("THB (Baht)")}
                      </p>
                    </div>
                  )}

                  <p className="mt-2 text-lg font-bold">
                    <strong>{t("Amount Due")}:</strong>{" "}
                    {formatCurrency(finalPrice)} {t("THB (Baht)")}
                  </p>
                </div>
                <p className="text-red-500">
                  ⚠️{" "}
                  {t(
                    "Please make the payment within 1 minute, otherwise the order will be canceled"
                  )}
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {!orderConfirmed ? (
            <>
              <AlertDialogCancel asChild>
                <button className="cursor-pointer">{t("Cancel")}</button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <button
                  onClick={handleOrderConfirmation}
                  className="cursor-pointer"
                >
                  {t("Confirm Payment")}
                </button>
              </AlertDialogAction>
            </>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
