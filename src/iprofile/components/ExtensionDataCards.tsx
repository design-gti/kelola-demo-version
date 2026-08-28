"use client";
import { useContext, useMemo } from "react";
import { ProfileContext } from "../lib/ProfileContext";
import { fieldsOf, findProfile } from "@/app/admin/profile-data/profiles";

const FONT = "'Open Sans', sans-serif";

/** Awalan id kartu data extension; sisanya slug bidangnya. */
export const EXTENSION_CARD_PREFIX = "ext:";

export const extensionCardId = (slug: string) => `${EXTENSION_CARD_PREFIX}${slug}`;
export const extensionSlugOf = (cardId: string) =>
  cardId.startsWith(EXTENSION_CARD_PREFIX) ? cardId.slice(EXTENSION_CARD_PREFIX.length) : null;

/**
 * Satu kartu untuk satu data extension.
 *
 * Kolom dan nilainya diambil dari sumber yang sama dengan halaman Admin >
 * Profile Data — bukan disalin ke sini. Jadi menambah kolom di sana langsung
 * menambah barisnya di kartu ini, dan angka yang disebut kedua halaman selalu
 * sama.
 */
export function ExtensionCard({ slug }: { slug: string }) {
  const { employeeId } = useContext(ProfileContext);
  const profile = useMemo(() => findProfile(slug), [slug]);
  const fields = useMemo(() => fieldsOf(slug), [slug]);

  /*
   * Tidak digambar sama sekali kalau bidangnya lenyap (daftar bidang hidup di
   * memori sesi) ATAU belum punya kolom — kartu kosong tidak menerangkan apa
   * pun, dan ia muncul sendiri begitu kolomnya ditambahkan di Admin.
   */
  if (!profile || fields.length === 0) return null;

  return (
    <div
      className="flex shrink-0 flex-col gap-[12px] rounded-[8px] bg-white p-[16px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]"
      style={{ width: 368 }}
      data-name={`Extension ${profile.name}`}
    >
      <div>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#495057" }}>{profile.name}</p>
        {profile.description && profile.description !== "-" && (
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#adb5bd", marginTop: 2 }}>{profile.description}</p>
        )}
      </div>

      <div className="flex flex-col">
          {fields.map((f, i) => {
            const raw = f.valueOf(employeeId || "default");
            return (
              <div
                key={f.key}
                className={`flex items-center justify-between gap-[10px] py-[8px] ${i > 0 ? "border-t border-[#f1f3f5]" : ""}`}
              >
                <span className="truncate" style={{ fontFamily: FONT, fontSize: 12, color: "#868e96" }}>
                  {f.label}
                </span>
                <span
                  className="shrink-0"
                  style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: raw == null ? "#ced4da" : "#495057" }}
                >
                  {f.format ? f.format(raw) : raw ?? "-"}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
