const encoder=new TextEncoder();
function secret(){const value=process.env.SESSION_SECRET;if(!value||value.length<32)throw new Error('SESSION_SECRET must be at least 32 characters');return value}
function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('')}
async function signature(payload:string){const key=await crypto.subtle.importKey('raw',encoder.encode(secret()),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,encoder.encode(payload)))}
export async function createSessionToken(){const payload=String(Date.now()+7*24*60*60*1000);return `${payload}.${await signature(payload)}`}
export async function verifySessionToken(token?:string){if(!token)return false;try{const[payload,sig]=token.split('.');if(!payload||!sig||Number(payload)<Date.now())return false;const expected=await signature(payload);if(expected.length!==sig.length)return false;let mismatch=0;for(let i=0;i<sig.length;i++)mismatch|=expected.charCodeAt(i)^sig.charCodeAt(i);return mismatch===0}catch{return false}}
