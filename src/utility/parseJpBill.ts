export const parseJpBill = (text: string) => {
  const standardizedText = text.replace(/[0-9]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0),
  );

  const cleanText = text.replace(/\s+/g, "");

  const amountKeywords = ["合計", "ご請求額", "金額", "税込", "小計"];
  const dateKeywords = ["期限", "振込", "支払日", "年月", "期限日"];

  let foundAmount = "";
  let foundDate = "";

  // search amount
  for (const word of amountKeywords) {
    const regex = new RegExp(`${word}(?:￥|¥)?([\\d,]+)`);
    const match = cleanText.match(regex);
    if (match) {
      foundAmount = match[1].replace(/,/g, "");
      if (parseInt(foundAmount) > 10) break;
    }
  }

  // search date
  const dateRegex = /(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})/;
  const dateMatch = cleanText.match(dateRegex);

  if (dateMatch) {
    const year = dateMatch[1];
    const month = dateMatch[2].padStart(2, "0");
    const day = dateMatch[3].padStart(2, "0");
    foundDate = `${year}-${month}-${day}`;
  }

  return { extractedAmount: foundAmount, extractedDate: foundDate };
};
