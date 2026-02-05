import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { CreditCard, ArrowRight } from 'lucide-react';
import TribeLoader from './TribeLoader';

const PaymentButton = ({ amount, email, name, phone, tx_ref, onSuccess, disabled, onBeforePayment }) => {
    // ... config same as before ...
    const config = {
        public_key: import.meta.env.VITE_FLW_PUBLIC_KEY || 'FLWPUBK_TEST-a6efc6362b842da8299dc4b96b6fd65e-X',
        tx_ref: tx_ref,
        amount: amount,
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: email,
            phone_number: phone || '',
            name: name,
        },
        customizations: {
            title: 'TribeTrade Checkout',
            description: 'Payment for your collected drops',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-abstract-symbol-vector-logo-design.jpg',
        },
    };

    const handleFlutterPayment = useFlutterwave(config);

    const handleClick = async () => {
        let finalConfig = { ...config };

        if (onBeforePayment) {
            try {
                const preparedData = await onBeforePayment();
                if (preparedData && preparedData.tx_ref) {
                    finalConfig.tx_ref = preparedData.tx_ref;
                }
            } catch (error) {
                console.error("Order preparation failed", error);
                return; // Stop if prep fails
            }
        }

        handleFlutterPayment({
            callback: (response) => {
                onSuccess(response);
                closePaymentModal();
            },
            onClose: () => {
                console.log("Payment Modal Closed");
            },
        });
    };

    return (
        <button
            disabled={disabled}
            onClick={handleClick}
            className="w-full btn-primary py-4 mt-6 flex items-center justify-center gap-2 overflow-hidden group relative !text-white"
        >
            <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap !text-white">
                Authorize Payment <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </button>
    );
};

export default PaymentButton;
