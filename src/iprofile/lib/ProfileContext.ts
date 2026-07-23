import { createContext } from "react";

export interface ProfileContextValue {
  name: string;
  position: string;
  /** Raw TDP employee id ("default" when none), used as the shared photo storage key
   * (`employee-photo-<employeeId>`) so an upload from TDP or iProfile shows up in both. */
  employeeId: string;
}

export const ProfileContext = createContext<ProfileContextValue>({
  name: "Hendra Wijaya",
  position: "Direktur Pengembangan Bisnis",
  employeeId: "default",
});
