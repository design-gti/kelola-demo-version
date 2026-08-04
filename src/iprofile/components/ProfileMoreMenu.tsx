"use client";
import { useState, useRef, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import svgPaths from '../imports/svg-djevy8uiqd';
import { ProfileContext } from '../lib/ProfileContext';
import { getEditedPhoto, setEditedPhoto } from '../lib/photoStore';
import { ChangePhotoModal } from './ChangePhotoModal';

export function ProfileMoreMenu() {
  const { employeeId } = useContext(ProfileContext);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [viewPhoto, setViewPhoto] = useState<string | null>(null);
  const [changeOpen, setChangeOpen] = useState(false);

  const currentPhoto = () => getEditedPhoto(employeeId) || '/iprofile-assets/profile-photo.png';

  // Dipanggil ChangePhotoModal setelah file lolos syarat PNG + background transparan.
  const applyPhoto = (dataUrl: string) => {
    setEditedPhoto(employeeId, dataUrl);
    window.dispatchEvent(new CustomEvent('profile-photo-changed', { detail: { employeeId, dataUrl } }));
    setChangeOpen(false);
  };

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4, // 4px gap below the button
        left: rect.right - 180, // 180px is the dropdown width, align to right
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="overflow-clip relative shrink-0 size-[16px] cursor-pointer"
        data-name="dots-vertical"
      >
        <div className="absolute inset-[16.67%_45.83%]" data-name="Vector">
          <div className="absolute inset-[-7.03%_-56.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.83333 12.1667">
              <g id="Vector">
                <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed w-[180px] bg-white rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)] overflow-hidden z-[9999]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                setChangeOpen(true);
              }}
              className="w-full px-[16px] py-[12px] text-left font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#495057] hover:bg-[#f8f9fa] transition-colors cursor-pointer"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Change profile photo
            </button>
            <div className="h-[1px] bg-[#dee2e6]" />
            <button
              onClick={() => {
                setIsOpen(false);
                setViewPhoto(currentPhoto());
              }}
              className="w-full px-[16px] py-[12px] text-left font-['Open_Sans:Regular',sans-serif] text-[12px] text-[#495057] hover:bg-[#f8f9fa] transition-colors cursor-pointer"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              View profile photo
            </button>
          </div>,
          document.body
        )}

      {changeOpen && (
        <ChangePhotoModal
          onClose={() => setChangeOpen(false)}
          onPicked={applyPhoto}
        />
      )}

      {/* View photo lightbox */}
      {viewPhoto && createPortal(
        <div
          onClick={() => setViewPhoto(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}
        >
          <img
            src={viewPhoto}
            alt="Profile photo"
            style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 12, objectFit: 'contain', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
            onClick={e => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  );
}


