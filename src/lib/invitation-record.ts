export type InvitationRecord = {
  id: string;
  name: string;
  uid: string;
  registeredAt: string;
  deposit: number;
};

export const INVITE_RECORDS: InvitationRecord[] = [
  { id: "1", name: "MemberNNGZ1AYC", uid: "15613576", registeredAt: "2024-12-29 19:08:39", deposit: 0 },
  { id: "2", name: "MemberNNGXXLRU", uid: "4975160", registeredAt: "2024-03-06 15:53:21", deposit: 0 },
  { id: "3", name: "MemberNNGWWENZ", uid: "4576706", registeredAt: "2024-03-02 11:30:33", deposit: 300 },
  { id: "4", name: "Apjabenkan", uid: "4233043", registeredAt: "2024-02-27 19:36:05", deposit: 1400 },
  { id: "5", name: "MemberNNGYS23J", uid: "3801631", registeredAt: "2024-02-22 21:52:04", deposit: 100 },
];
