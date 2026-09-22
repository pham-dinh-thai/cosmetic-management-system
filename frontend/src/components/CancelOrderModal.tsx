import React from 'react';

interface CancelOrderModalProps {
  isOpen: boolean;
  orderCode?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  orderCode,
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#fcfcf7] border border-[#eeeee9] rounded-3xl p-7 sm:p-9 w-full max-w-[420px] shadow-[0_24px_64px_rgba(28,58,19,0.08)] flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Đóng"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-[#eeeee9] text-[#777777] hover:text-[#1c3a13] hover:bg-[#fcfcf7] hover:border-[#deded8] flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Warning Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-[#fdf0ed] border border-[#f7c7c0] text-[#9c2b20] flex items-center justify-center mb-5 shadow-xs shrink-0">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-[22px] font-serif font-medium text-[#1c3a13] tracking-tight mb-2">
          Xác nhận hủy đơn hàng
        </h3>

        {/* Order Code Pill */}
        {orderCode && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#eeeee9] font-mono text-[13px] text-[#666666] mb-4 shadow-2xs">
            <span>Mã đơn:</span>
            <strong className="text-[#1c3a13]">#{orderCode}</strong>
          </div>
        )}

        {/* Description message */}
        <p className="text-[14px] text-[#666666] leading-relaxed mb-7 max-w-[340px]">
          Bạn có chắc chắn muốn hủy đơn hàng này không? Sau khi xác nhận hủy, đơn hàng sẽ không thể khôi phục lại trạng thái ban đầu.
        </p>

        {/* Symmetric 2-Button Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 rounded-full text-[13px] font-medium text-[#1c3a13] border border-[#eeeee9] bg-white hover:bg-[#fcfcf7] hover:border-[#deded8] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            Giữ lại đơn hàng
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3 rounded-full text-[13px] font-medium text-white bg-[#9c2b20] hover:bg-[#85231a] transition-all shadow-[0_2px_10px_rgba(156,43,32,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Đang hủy...</span>
              </>
            ) : (
              <span>Xác nhận hủy</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
