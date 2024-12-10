export const EMAIL_VALIDATION = /^(?!.*[_.-]{2})[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const MOBILE_VALIDATION = /^\+(?:[0-9] ?){6,14}[0-9]$/
export const MOBILE_NUMBER_VALIDATION = /^[0-9]+$/
export const EMAIL_MOBILE_DISTINGUISHER = /^\+?[0-9]*$/

// credit card regex
export const AMEX = /^3[47][0-9]{13}$/
export const BCGLOBAL = /^(6541|6556)[0-9]{12}$/
export const CARTEBLANCHE = /^389[0-9]{11}$/
export const DINERSCLUB = /^3(?=0[0-5]|[68][0-9])[0-9]{11}$/
export const DISCOVER = /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?=12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/
export const INSTAPAYMENT = /^63[7-9][0-9]{13}$/
export const JCB = /^(?=2131|1800|35\d{3})\d{11}$/
export const KOREANLOCAL = /^9[0-9]{15}$/
export const LASER = /^(6304|6706|6709|6771)[0-9]{121export const5}$/
export const MAESTRO = /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{81export const5}$/
export const MASTERCARD = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/
export const SOLO = /^(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15}$/
export const SWITCH = /^(4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13}$/
export const UNIONPAY = /^62[0-9]{141export const7}$/
export const VISA = /^4[0-9]{12}(?:[0-9]{3})?$/
export const VISAMASTER = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/

export const AMEX_TYPE_CHECK = /^(34|37)/
export const VISA_TYPE_CHECK = /^4/
export const MASTERCARD_TYPE_CHECK = /^(5[1-5]|2(2[2-9]|7[0-2]))/

export const CREDIT_CARD_VALIDITY = /^(0[1-9]|1[0-2])\/(2[2-9]|2[3-9]|3[0-9])$/
export const CREDIT_CARD_CVV = /^\d{3}$/
export const AMEX_CREDIT_CARD_CVV = /^\d{4}$/
export const NAME_VALIDATION = /^[0-9.,'’\-\p{L} ]+$/iu
export const AUSTRALIAN_NUMBER = /^(\\d{4})$/

export const CHECK_MOBILE = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i

export const CHECK_PHONE = /iPhone|Android|webOS|BlackBerry|Windows Phone/i
