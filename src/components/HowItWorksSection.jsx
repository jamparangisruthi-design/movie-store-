import React from 'react';
import { Search, Tv, Link2, MessageSquare, Sparkles, Mic, Heart, ShieldCheck } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Search Content",
      desc: "Find any movie, series, or video using our legitimate metadata discovery engine."
    },
    {
      num: "02",
      icon: Tv,
      title: "Create Watch Room",
      desc: "Set room privacy, max participants, enable voice/text chat, and customize settings."
    },
    {
      num: "03",
      icon: Link2,
      title: "Invite Friends",
      desc: "Share your instant room link or QR code with friends across mobile, desktop, or tablet."
    },
    {
      num: "04",
      icon: Heart,
      title: "Share Screen & React",
      desc: "Host streams their browser tab/screen via WebRTC with live voice chat and floating reactions."
    }
  ];

  return (
    <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 24px 80px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, marginBottom: '12px' }}>
          How WatchTogether Works
        </h2>
        <p style={{ fontSize: '1rem', color: '#94a3b8' }}>
          Four simple steps to host the ultimate virtual movie night with your squad
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.num}
              className="glass-panel"
              style={{
                padding: '32px 24px',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '2rem', fontWeight: 900, color: 'rgba(255,255,255,0.05)' }}>
                {step.num}
              </div>

              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(229,9,20,0.2) 100%)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Icon size={24} color="#818cf8" />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
