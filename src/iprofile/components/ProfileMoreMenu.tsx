"use client";
import { useState, useRef, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
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

  // Sumber foto identik dengan kartu Profile (Frame45227): per-employee
  // /avatars/employee/<id>.png, fallback ke default generik.
  const defaultPhoto = /^p\d+$/i.test(employeeId) ? `/avatars/employee/${employeeId.toLowerCase()}.png` : '/iprofile-assets/profile-photo.png';
  const currentPhoto = () => getEditedPhoto(employeeId) || defaultPhoto;

  // Dipanggil ChangePhotoModal setelah file lolos syarat PNG + background transparan.
  const applyPhoto = (dataUrl: string) => {
    setEditedPhoto(employeeId, dataUrl);
    window.dispatchEvent(new CustomEvent('profile-photo-changed', { detail: { employeeId, dataUrl } }));
    setChangeOpen(false);
  };

  /**
   * Menu muncul di titik klik, bukan di bawah kotak pemicunya.
   *
   * Pemicunya sekarang seluruh bidang foto (300×300), bukan tombol 16px. Kalau
   * posisinya dihitung dari tepi bawah pemicu, menunya melompat ~300px ke bawah
   * dari tempat kursor menekan dan terbaca seperti milik kartu di bawahnya.
   *
   * Dijepit ke dalam viewport supaya klik di dekat tepi kanan/bawah tidak
   * mendorong menunya keluar layar.
   */
  const openAt = (e: React.MouseEvent) => {
    const W = 180;
    const H = 92;
    setDropdownPosition({
      top: Math.min(e.clientY + 4, window.innerHeight - H - 8),
      left: Math.max(8, Math.min(e.clientX - W / 2, window.innerWidth - W - 8)),
    });
    setIsOpen(v => !v);
  };

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
      {/*
        Pemicunya bidang tembus pandang yang mengisi wadahnya, bukan tombol
        titik-tiga. Wadahnya (kartu Profile) menaruhnya tepat di atas foto, jadi
        yang diklik user adalah fotonya sendiri.
      */}
      <button
        ref={buttonRef}
        onClick={openAt}
        className="absolute inset-0 cursor-pointer"
        style={{ background: "transparent", border: "none", padding: 0 }}
        aria-label="Opsi foto profil"
        title="Klik untuk lihat atau ubah foto profil"
      />

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
            onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.src = '/iprofile-assets/profile-photo.png'; t.onerror = null; }}
          />
        </div>,
        document.body
      )}
    </>
  );
}


