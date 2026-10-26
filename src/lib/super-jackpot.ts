export type JackpotRecord = {
  id: string;
  amount: number;
  time: string;
};

export const JACKPOT_RECORDS: JackpotRecord[] = [];

export const JACKPOT_RULES_TABLE_HTML = `
<table>
  <thead>
    <tr>
      <th>Winning rate</th>
      <th>Bet amount</th>
      <th>Bonus</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>10X-20X</td><td>₹1-₹10</td><td>₹1.00</td></tr>
    <tr><td>20X-50X</td><td>₹1-₹10</td><td>₹2.00</td></tr>
    <tr><td>50X-100X</td><td>₹1-₹10</td><td>₹5.00</td></tr>
    <tr><td>100X-500X</td><td>₹1-₹10</td><td>₹10.00</td></tr>
    <tr><td>500X-1000X</td><td>₹1-₹10</td><td>₹20.00</td></tr>
    <tr><td>1000X-10000X</td><td>₹1-₹10</td><td>₹50.00</td></tr>
  </tbody>
</table>
`;
