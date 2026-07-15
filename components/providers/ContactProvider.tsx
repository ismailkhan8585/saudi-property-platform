'use client';
import { createContext, useContext } from 'react';
import type { PublicContactConfig } from '@/lib/contact';
const ContactContext=createContext<PublicContactConfig>({whatsappNumber:null,businessPhone:null,phoneDisplay:'+966 XX XXX XXXX',email:'info@example.sa',configured:false});
export function ContactProvider({value,children}:{value:PublicContactConfig;children:React.ReactNode}){return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>}
export function useContact(){return useContext(ContactContext)}
