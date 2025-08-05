// import type { Message, SenderType } from './types';

// // Sample messages for AI and Human chats
// const messageSamplesAI = [
//   "Hello, I need some AI assistance.",
//   "Can you analyze this data for me?",
//   "What is the forecast for tomorrow?",
//   "Please provide insights on this report.",
//   "Can the AI generate a summary?",
//   "Tell me more about this topic.",
//   "Are there any alerts I should be aware of?",
//   "Can you automate this task?",
//   "What's the status of my request?",
//   "Thanks, that was helpful!",
//   "Could you suggest improvements?",
//   "What's the sentiment of this text?",
//   "How do I optimize this process?",
//   "Can you detect anomalies here?",
//   "Is the data consistent?",
//   "What recommendations do you have?",
//   "How fast can this be done?",
//   "Please verify the results.",
//   "Can you classify this document?",
//   "Let me know if there are errors.",
//   "Thanks for your support!",
//   "Is this compliant with policies?",
//   "Can you generate a report?",
//   "What's the confidence level?",
//   "Any risks detected?",
//   "How accurate is this prediction?",
//   "Could you provide examples?",
//   "Can I integrate this with my system?",
//   "Will this improve efficiency?",
//   "Is this data reliable?",
// ];

// const messageSamplesHuman = [
//   "Hello, I need human help.",
//   "Can you assist me with my order?",
//   "I have a problem with my delivery.",
//   "When will my refund be processed?",
//   "Can you escalate this issue?",
//   "Thank you for your assistance.",
//   "I want to speak with a manager.",
//   "Is there an update on my ticket?",
//   "Please provide more details.",
//   "I am not satisfied with the response.",
//   "Can you clarify the policy?",
//   "How long will this take?",
//   "Please resolve this quickly.",
//   "Thanks for your patience.",
//   "Can you call me back?",
//   "I have additional questions.",
//   "Please confirm receipt.",
//   "Is there a discount available?",
//   "Can you update my information?",
//   "Thanks for your help!",
// ];

// function randomTimeOffset(minMins: number, maxMins: number) {
//   return Math.floor(Math.random() * (maxMins - minMins) + minMins) * 60000;
// }

// export const dummyChats = [
//   // 10 AI chats
//   ...Array(10).fill(null).map((_, i) => ({
//     id: `ai_chat_${i + 1}`,
//     page_name: `AI Page ${i + 1}`,
//     page_type: ["facebook", "whatsapp", "instagram"][i % 3],
//     customer_name: `AI User ${i + 1}`,
//     is_human: false,
//     assigned_to: null,
//     unread_count: Math.floor(Math.random() * 5),
//     last_message: `Last AI message for chat ${i + 1}`,
//     last_message_time: new Date(Date.now() - i * 3600 * 1000).toISOString(),
//     created_at: new Date(Date.now() - (i + 1) * 86400 * 1000).toISOString(),
//     updated_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
//   })),

//   // 4 Human chats
//   ...Array(4).fill(null).map((_, i) => ({
//     id: `human_chat_${i + 1}`,
//     page_name: `Human Support ${i + 1}`,
//     page_type: ["facebook", "whatsapp", "instagram"][i % 3],
//     customer_name: `Human User ${i + 1}`,
//     is_human: true,
//     assigned_to: i + 1,
//     unread_count: Math.floor(Math.random() * 3),
//     last_message: `Last human message for chat ${i + 1}`,
//     last_message_time: new Date(Date.now() - (i + 1) * 2 * 3600 * 1000).toISOString(),
//     created_at: new Date(Date.now() - (i + 2) * 86400 * 1000).toISOString(),
//     updated_at: new Date(Date.now() - (i + 1) * 2 * 3600 * 1000).toISOString(),
//   })),
// ];

// export const dummyMessages: Message[] = [
//   // AI chats with 20-30 messages each
//   ...Array(10).fill(null).flatMap((_, i) => {
//     const chatId = `ai_chat_${i + 1}`;
//     const messageCount = 20 + Math.floor(Math.random() * 11); // 20-30 messages
//     const baseTime = Date.now() - i * 3600 * 1000;

//     return Array(messageCount).fill(null).map((__, idx): Message => {
//       const sender_type: SenderType = idx % 2 === 0 ? "customer" : "ai";
//       return {
//         id: `msg_ai_${i + 1}_${idx + 1}`,
//         chat_id: chatId,
//         content: messageSamplesAI[Math.floor(Math.random() * messageSamplesAI.length)],
//         sender_type,
//         timestamp: new Date(baseTime + idx * 60000 + randomTimeOffset(0, 5)).toISOString(),
//         is_read: idx % 5 !== 0,
//       };
//     });
//   }),

//   // Human chats with 10-20 messages each
//   ...Array(4).fill(null).flatMap((_, i) => {
//     const chatId = `human_chat_${i + 1}`;
//     const messageCount = 10 + Math.floor(Math.random() * 11); // 10-20 messages
//     const baseTime = Date.now() - i * 7200 * 1000;

//     return Array(messageCount).fill(null).map((__, idx): Message => {
//       const sender_type: SenderType = idx % 2 === 0 ? "customer" : "agent";
//       return {
//         id: `msg_human_${i + 1}_${idx + 1}`,
//         chat_id: chatId,
//         content: messageSamplesHuman[Math.floor(Math.random() * messageSamplesHuman.length)],
//         sender_type,
//         timestamp: new Date(baseTime + idx * 90000 + randomTimeOffset(0, 5)).toISOString(),
//         is_read: idx % 3 !== 0,
//       };
//     });
//   }),
// ];
