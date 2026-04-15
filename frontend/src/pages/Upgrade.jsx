import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, CheckCircle, ArrowLeft, ShieldCheck, Zap, X, Info } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const Upgrade = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to upgrade.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      let order;
      let retries = 3;
      while (retries > 0) {
        try {
          const { data } = await axiosInstance.post("/api/payment/orders", {
            amount: 99, 
          });
          order = data;
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          
          if (!error.response || error.response.status >= 500 || error.code === 'ERR_NETWORK') {
              toast.info(`Engine waking up... Retrying payment init (${3 - retries}/2)...`, { autoClose: 2500, toastId: 'payment-retry' });
              await new Promise(resolve => setTimeout(resolve, 3000));
          } else {
              throw error; 
          }
        }
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "RE-DOCS PRO",
        description: "Lifetime Membership Access",
        image: "/assets/logo.png",
        order_id: order.id,
        modal: {
          backdropclose: false,
          escape: true,
          handleback: true,
          animation: true,
          confirm_close: true,
          ondismiss: function() {
            setLoading(false);
          }
        },
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          try {
            await axiosInstance.post("/api/payment/verify", {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              signature: razorpay_signature,
            });
            
            toast.success("Payment Successful! Welcome to Pro.");
            window.location.href = "/profile/MyProfile?pro=success";
          } catch (err) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(response) {
        toast.error("Payment Failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment Initiation Error:", err);
      toast.error(err.response?.data?.error || "Failed to initiate payment.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background more visible (Reduced opacity) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(-1)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
      />

      {/* Smaller Modal (max-w-xs / max-w-sm) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-sm w-full bg-[#10110f] border-2 border-white/20 rounded-2xl shadow-3xl overflow-hidden relative z-10"
      >
        <div className="p-6 sm:p-8 text-center relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 p-2 text-type-3 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-black text-white font-mono italic tracking-tighter uppercase">
                Unlock Pro
            </h1>
            <p className="text-[8px] text-type-3 font-mono uppercase tracking-[0.3em] font-bold">
                Lifetime Legacy Access
            </p>
          </div>

          {/* Test Mode Warning (RED) */}
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-base font-mono text-red-500 font-bold uppercase leading-tight tracking-tighter">
              DEVELOPMENT TEST MODE ACTIVE. USE ANY FAKE UPI ID (E.G. SUCCESS@RAZORPAY). NO REAL MONEY WILL BE DEDUCTED.
            </p>
          </div>
     

          <div className="space-y-3 mb-8 text-left">
             <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <Zap className="w-4 h-4 text-white shrink-0" />
                <p className="text-[10px] text-white font-mono uppercase font-black italic tracking-tighter">2,000 Notes / hr Sync Speed</p>
             </div>
             <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <CheckCircle className="w-4 h-4 text-white shrink-0" />
                <p className="text-[10px] text-white font-mono uppercase font-black italic tracking-tighter">5 Concurrent upload streams</p>
             </div>
             <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <p className="text-[10px] text-white font-mono uppercase font-black italic tracking-tighter">ZIP Exports & Advanced Tagging</p>
             </div>
          </div>

          <div className="mb-8 py-4 rounded-xl border-2 border-white/10 bg-white/[0.01]">
            <div className="text-4xl font-black text-white font-mono italic">₹99</div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full relative flex items-center justify-center gap-3 py-4 bg-white hover:bg-zinc-200 text-black font-black font-mono rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50 border-b-4 border-zinc-400 uppercase italic text-sm"
          >
            {loading ? "INITIALIZING..." : (
              <>
                Confirm Order
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>

          <p className="text-[8px] text-type-3 font-mono mt-6 uppercase opacity-40">
            Securely encrypted via Razorpay v1.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Upgrade;
