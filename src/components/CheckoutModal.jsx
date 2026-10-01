import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Tag, 
  ArrowRight,
  QrCode,
  Download,
  Play
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const CheckoutModal = () => {
  const { 
    activeModal, 
    closeModal, 
    openModal, 
    cart, 
    removeFromCart, 
    clearCart, 
    completePurchase, 
    formatPrice, 
    soundEnabled,
    showToast 
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Card input states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('842');

  if (activeModal.type !== 'checkout') return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = subtotal * discountPercent;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'CINE50') {
      setDiscountPercent(0.5);
      setAppliedCode('CINE50 (50% OFF)');
      showToast('Promo Code Applied', '50% discount applied to your order!', 'success');
    } else if (code === 'CINEMA2026' || code === 'FREE') {
      setDiscountPercent(1.0);
      setAppliedCode('CINEMA2026 (100% FREE)');
      showToast('Free Pass Applied', '100% discount pass applied!', 'success');
    } else if (code === 'VIP30') {
      setDiscountPercent(0.3);
      setAppliedCode('VIP30 (30% OFF)');
      showToast('VIP Promo Applied', '30% VIP discount applied!', 'success');
    } else {
      showToast('Invalid Code', 'Try codes: CINE50, CINEMA2026, or VIP30', 'warning');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    playSound('click', soundEnabled);

    setTimeout(() => {
      setIsProcessing(false);
      const receiptData = completePurchase(cart, discountPercent, paymentMethod);
      setReceipt(receiptData);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-container"
        style={{ width: '780px', maxWidth: '95vw', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={closeModal}>
          <X size={20} />
        </button>

        {!receipt ? (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Your Digital Cinema Cart</h2>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Instant license delivery with lifetime 4K streaming and offline backup
                </p>
              </div>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <ShoppingBag size={56} color="#64748b" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Your Cart is Empty</h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>
                  Explore the 4K Ultra HD catalog to add movies and rentals to your collection.
                </p>
                <button className="btn btn-primary" onClick={closeModal}>
                  Browse 4K Movies
                </button>
              </div>
            ) : (
              <div>
                {/* Cart Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', maxHeight: '280px', overflowY: 'auto' }}>
                  {cart.map((item) => (
                    <div 
                      key={item.cartId}
                      className="glass-panel"
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={item.movie.poster} 
                          alt={item.movie.title} 
                          style={{ width: '44px', height: '64px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{item.movie.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span className={item.type === 'buy' ? 'badge-4k' : 'badge-rating'} style={{ fontSize: '0.65rem' }}>
                              {item.type === 'buy' ? '4K UHD KEEP FOREVER' : '48-HOUR HD RENTAL'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.movie.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                          {formatPrice(item.price)}
                        </span>
                        <button 
                          className="btn-icon" 
                          onClick={() => removeFromCart(item.cartId)}
                          style={{ width: '32px', height: '32px', color: '#ef4444' }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Promo Code (try: CINE50, CINEMA2026)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        color: '#fff',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <button type="submit" className="btn btn-glass" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                    Apply Code
                  </button>
                </form>

                {/* Payment Methods */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px' }}>
                    Select Payment Method:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    {[
                      { id: 'card', label: 'Credit Card', icon: CreditCard },
                      { id: 'apple', label: 'Apple Pay', icon: Sparkles },
                      { id: 'google', label: 'Google Pay', icon: ShieldCheck },
                      { id: 'vault', label: 'CinePass Balance', icon: CheckCircle2 }
                    ].map((pm) => {
                      const Icon = pm.icon;
                      return (
                        <div
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          style={{
                            background: paymentMethod === pm.id ? 'rgba(229, 9, 20, 0.2)' : 'rgba(255,255,255,0.04)',
                            border: paymentMethod === pm.id ? '1px solid var(--accent-red)' : '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Icon size={16} color={paymentMethod === pm.id ? '#e50914' : '#94a3b8'} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: paymentMethod === pm.id ? '#fff' : '#cbd5e1' }}>
                            {pm.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary Breakdown */}
                <div className="glass-panel" style={{ padding: '18px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>
                    <span>Subtotal ({cart.length} items):</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {appliedCode && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#10b981', marginBottom: '8px' }}>
                      <span>Discount ({appliedCode}):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '12px' }}>
                    <span>Digital License & Cloud Backup:</span>
                    <span style={{ color: '#10b981' }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 900, color: '#fff', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  className="btn btn-primary"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  style={{ width: '100%', padding: '14px', fontSize: '1.05rem', gap: '10px' }}
                >
                  {isProcessing ? (
                    <span>Authorizing 4K Cloud License...</span>
                  ) : (
                    <>
                      <span>Authorize & Complete Digital Purchase ({formatPrice(total)})</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Receipt / Digital CineVault Pass View */
          <div style={{ animation: 'modalFadeIn 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                <CheckCircle2 size={32} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Payment Approved!</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Your digital movies and rental passes are now active in your Vault.
              </p>
            </div>

            {/* Perforated Ticket Card */}
            <div className="vault-ticket" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <span className="badge-4k" style={{ fontSize: '0.7rem' }}>OFFICIAL DIGITAL PASS</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                    Order ID: {receipt.orderId}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{receipt.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <QrCode size={48} color="#f59e0b" />
                </div>
              </div>

              {/* Items in Receipt */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {receipt.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.movie.poster} alt={item.movie.title} style={{ width: '32px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{item.movie.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                          {item.type === 'buy' ? '4K UHD Digital Copy' : '48-Hour Rental License'}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#fff' }}>{formatPrice(item.price * (1 - receipt.discount))}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.15)' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Amount Paid:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>{formatPrice(receipt.totalPaid)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => { closeModal(); openModal('vault', { defaultTab: 'library' }); }}
                style={{ flex: 1, padding: '12px' }}
              >
                <Play size={16} fill="#fff" /> Open My Vault & Stream
              </button>
              <button 
                className="btn btn-glass"
                onClick={closeModal}
                style={{ padding: '12px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
