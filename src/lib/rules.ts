import type { WinGoInterval } from "./wingo";

export const PRESALE_RULES = `In order to protect the legitimate rights and interests of users participating in the pre-sale and maintain the normal operating order of the pre-sale, these rules are formulated in accordance with relevant agreements and laws and regulations.

Chapter 1 Definition
1.1 Pre-sale definition: refers to a sales model in which a seller offers a bundle of a product or service, collects consumer orders through product tools before selling, and makes it available to customers. consumers of goods and/or services by prior agreement
1.2 Presale mode is "deposit" mode. "Consignment" refers to the pre-delivery of a fixed number of items prior to sale. "Deposit" refers to a pre-sale model in which a consumer pays a certain percentage of the deposit in advance when placing an order. After the product or service is available, the remaining amount is paid according to the agreement.

Chapter 2 Presale
2.1 Lottery
2.1.1 After placing an order, you can wait for the lottery. After winning, you can get the product according to the payment time. If you miss the payment, you will be deemed to have given up.
2.1.2 After the lottery, if the prize is not won, the deposit will be refunded to the original account. If the prize is won, the remaining amount must be paid within the specified time.

2.2 Deposit
If the pre-sale is successful, the deposit can be converted into the purchase price. If the pre-sale fails, the deposit will be refunded in full.

Chapter 3 Commodity
3.1 The pre-sale product information is based on the page display. Please confirm the product details before placing an order.
3.2 If the product cannot be delivered due to force majeure, the paid amount will be refunded.

Chapter 4 Supplementary
4.1 If you participate in the pre-sale, you are deemed to have agreed to these rules.
4.2 The platform has the right to interpret these rules within the scope permitted by law.`;

const INTERVAL_INTRO: Record<WinGoInterval, string> = {
  30: "30seconds 1 issue, 25 seconds to order, 5 seconds waiting for the draw. It opens all day. The total number of trade is 2880 issues.",
  60: "1 minute 1 issue, 55 seconds to order, 5 seconds waiting for the draw. It opens all day. The total number of trade is 1440 issues.",
  180: "3 minutes 1 issue, 175 seconds to order, 5 seconds waiting for the draw. It opens all day. The total number of trade is 480 issues.",
  300: "5 minutes 1 issue, 295 seconds to order, 5 seconds waiting for the draw. It opens all day. The total number of trade is 288 issues.",
};

export function wingoHowToPlay(interval: WinGoInterval) {
  return [
    INTERVAL_INTRO[interval],
    "If you spend 100 to trade, after deducting 2 service fee, your contract amount is 98:",
    "1. Select green: if the result shows 1,3,7,9 you will get (98*2) 196;If the result shows 5, you will get (98*1.5) 147",
    "2. Select red: if the result shows 2,4,6,8 you will get (98*2) 196;If the result shows 0, you will get (98*1.5) 147",
    "3. Select violet:if the result shows 0 or 5, you will get (98*4.5) 441",
    "4. Select number:if the result is the same as the number you selected, you will get (98*9) 882",
    "5. Select big: if the result shows 5,6,7,8,9 you will get (98 * 2) 196",
    "6. Select small: if the result shows 0,1,2,3,4 you will get (98 * 2) 196",
  ];
}
