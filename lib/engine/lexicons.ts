export const OTP_REQUEST =
  /\b(send|share|ibigay|ibahagi|ipadala|i-text|reply with)\b[^.\n]{0,40}\b(otp|pin|verification code|one[- ]time (password|pin|code)|code)\b/;

export const OTP_REFUSAL =
  /\b(never|huwag|don'?t|do not|ayaw)\b[^.\n]{0,20}\b(share|ibigay|ibahagi)\b/;

export const CREDENTIAL_REQUEST =
  /\b(enter|provide|send|type|ibigay|ilagay|share)\b[^.\n]{0,40}\b(password|passcode|cvv|card number|account number|pin)\b/;

export const PRIZE =
  /\b(congratulations|congrats|winner|won|raffle|lottery|jackpot|premyo|panalo)\b/;

export const MONEY_REQUEST =
  /\b(send load|load mo|mag-load|magload|cash in|transfer|processing fee|bayad|magbayad|deposit)\b/;

export const IMPERSONATED_BRANDS =
  /\b(bdo|bpi|gcash|maya|metrobank|landbank|unionbank|pnb|rcbc|eastwest|chinabank|security bank|sss|pag-ibig|philhealth|bir|nbi|meralco|globe|smart|pldt)\b/;

export const VERIFY_DEMAND =
  /\b(verify|verification|suspended|deactivated|blocked|reactivate|update your|confirm your|validate)\b/;

export const THREAT =
  /\b(suspended|deactivated|blocked|closed|frozen|legal action|kaso|cancel(?:led)?|ma-deactivate)\b/;

export const URGENCY =
  /\b(within 24 hours|within 48 hours|final notice|last chance|act now|immediately|urgent|agad)\b/;

export const JOB_OFFER =
  /\b(earn|kumita|income|salary|sweldo)\b[^.\n]{0,50}\b(daily|per day|araw|no experience|wfh|work from home|part[- ]time)\b/;

export const CONTACT_OFFSITE = /\b(telegram|viber|whatsapp|messenger)\b/;

export const TAGLISH_URGENCY =
  /\b(agad|ngayon na|bilisan|huling araw|i-click|pindutin|magmadali)\b/;
