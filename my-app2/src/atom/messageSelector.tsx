// import { selectorFamily } from 'recoil';
// import { messagesAtom } from './messagesAtom';
// import {useSetRecoilState} from 'recoil';

// const fetchMessagesFromDB = async (id: string) => {
//   const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
//   const data = await response.json();
//   return data;
// };

// export const messagesSelector = selectorFamily<React.ReactNode[], string>({
//   key: 'messagesSelector',
//   get: (id) => async ({ get }) => {
//     const messages = get(messagesAtom);

//     if (messages[id]) {
//       return messages[id];
//     }

//     const setMessages = useSetRecoilState(messagesAtom);
//     const fetchedMessages = await fetchMessagesFromDB(id);
//     setMessages({id: fetchedMessages});
//     return fetchedMessages;
//   },
// });
