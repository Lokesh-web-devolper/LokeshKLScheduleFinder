import React from 'react';
import { GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <GraduationCap size={22} className="footer-icon" />
              <span className="footer-title">KL Schedule Finder</span>
            </div>
            <p className="footer-desc">
              Official Examination & Laboratory Schedule Portal for Koneru Lakshmaiah
              Education Foundation (Deemed to be University). Academic Year 2026–27.
            </p>
          </div>

          <div className="footer-features">
            <div className="footer-badge">
              <ShieldCheck size={16} className="text-emerald" />
              <span>100% Client-Side In-Browser Processing</span>
            </div>
            <div className="footer-badge">
              <Sparkles size={16} className="text-blue" />
              <span>SheetJS Excel Engine Enabled</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright-text">
            © 2026–2027 KL Deemed to be University. All Rights Reserved.
          </div>
          <div className="footer-tagline">
            Designed for Student Success & Effortless Exam Preparation
          </div>
        </div>
      </div>
    </footer>
  );
}
