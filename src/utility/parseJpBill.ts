export const parseJpBill = (text: string) => {
  // Clean up
  // 1. Normalize or standardize text
  const standardizedText = text.replace(/[０-９]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0),
  );

  // 2. Remove Spaces
  const cleanText = standardizedText
    .split("\n")
    .map((line) => line.replace(/\s+/g, ""));

  let foundAmount = "";
  let foundDate = "";

  // Extract data
  // 1. detect AMOUNT
  const amountKeywords = [
    "合計",
    "ご請求",
    "支払",
    "PayPay",
    "現計",
    "対象金額",
  ];

  for (const text of cleanText) {
    for (const word of amountKeywords) {
      if (text.includes(word)) {
        const numbertMatch = text.match(/(?:¥|￥|\\)?(\d[\d,]+)/);
        if (numbertMatch) {
          const parsedNumber = numbertMatch[1].replace(/,/g, "");

          // seperate small amount like taxes
          if (parseInt(parsedNumber) > 200) {
            foundAmount = parsedNumber;
            break;
          }
        }
      }
    }
    if (foundAmount) break;
  }

  // 2. detect DATE
  for (const text of cleanText) {
    const DateRegex = /(\d{4})[年/-](\d{1,2})[月/-](\d{1,2}|[a-zA-Z1-9]+)/;
    const dateMatch = text.match(DateRegex);

    if (dateMatch) {
      const year = dateMatch[1];
      const month = dateMatch[2].padStart(2, "0");
      // clean up for day
      let dayRaw = dateMatch[3];
      let dayClean = dayRaw.replace(/\D/g, "");
      if (!dayClean) dayClean = "01";
      const day = dayClean.padStart(2, "0");

      foundDate = `${year}-${month}-${day}`;
      break;
    }
  }
  return { extractedAmount: foundAmount, extractedDate: foundDate };
};
