export const PROMOTION_REBATE_LEVELS = [
  { lv: 0, team: "0", bet: "0", deposit: "0" },
  { lv: 1, team: "5", bet: "500K", deposit: "100K" },
  { lv: 2, team: "10", bet: "1,000K", deposit: "200K" },
  { lv: 3, team: "15", bet: "2.50M", deposit: "500K" },
  { lv: 4, team: "20", bet: "3.50M", deposit: "700K" },
  { lv: 5, team: "25", bet: "5M", deposit: "1,000K" },
  { lv: 6, team: "30", bet: "10M", deposit: "2M" },
  { lv: 7, team: "100", bet: "100M", deposit: "20M" },
  { lv: 8, team: "500", bet: "500M", deposit: "100M" },
  { lv: 9, team: "1000", bet: "1,000M", deposit: "200M" },
  { lv: 10, team: "5000", bet: "1,500M", deposit: "300M" },
];

export const PROMOTION_RULES_HTML = [
  `<p>There are 6 subordinate levels in inviting friends, if A invites B, then B is a level 1 subordinate of A. If B invites C, then C is a level 1 subordinate of B and also a level 2 subordinate of A. If C invites D, then D is a level 1 subordinate of C, at the same time a level 2 subordinate of B and also a level 3 subordinate of A.</p>`,
  `<p>When inviting friends to register, you must send the invitation link provided or enter the invitation code manually so that your friends become your level 1 subordinates.</p>`,
  `<p>The invitee registers via the inviter's invitation code and completes the deposit, shortly after that the commission will be received immediately</p>`,
  `<p>The calculation of yesterday's commission starts every morning at 01:00. After the commission calculation is completed, the commission is rewarded to the wallet and can be viewed through the commission collection record.</p>`,
  `<p>The commission percentage depends on the agency level. The higher the membership level, the different the extra bonus.</p>`,
  `<p>The commission percentage depends on the membership level. The higher the membership level, the higher the bonus percentage. Different game types also have different payout percentages.</p><p>The commission rate is specifically explained as follows</p>`,
  `<p>TOP20 commission rankings will be randomly awarded with a separate bonus</p>`,
  `<p>The final interpretation of this activity belongs to 91club</p>`,
];
