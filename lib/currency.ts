export function formatSAR(amount:number,locale='en-SA'){return new Intl.NumberFormat(locale,{style:'currency',currency:'SAR',maximumFractionDigits:0}).format(amount)}
export function formatRent(amount:number,locale='en-SA'){return `${formatSAR(amount,locale)} / month`}
export function formatPriceShort(amount:number,locale='en-SA'){return new Intl.NumberFormat(locale,{notation:'compact',maximumFractionDigits:1}).format(amount)}
