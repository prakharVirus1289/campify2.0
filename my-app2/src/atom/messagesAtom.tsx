import { atom } from 'recoil';
import React from 'react';

interface MessagesState {
  id : string;
  messages: React.JSX.Element[];
}

export const messagesAtom = atom<MessagesState>({
  key: 'messagesAtom', // Unique key for the atom
  default: {id: '', messages: []},         // Default state is an empty object
});
