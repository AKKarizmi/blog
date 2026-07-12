import type { Conversation, Message } from '../types/Message';

export const mockConversations: Conversation[] = [
{
  id: 'conv_1',
  participantId: 'usr_2',
  participantName: 'Sarah Johnson',
  participantAvatar:
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  lastMessage: 'Sounds good, see you then!',
  lastMessageAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  unreadCount: 2
},
{
  id: 'conv_2',
  participantId: 'usr_3',
  participantName: 'Marcus Chen',
  lastMessage: 'Can you review the schedule?',
  lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  unreadCount: 1
},
{
  id: 'conv_3',
  participantId: 'usr_4',
  participantName: 'Emily Rodriguez',
  lastMessage: 'Thanks for the update!',
  lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  unreadCount: 0
}];


const now = Date.now();

export const mockMessages: Message[] = [
// Conv 1
{
  id: 'm1_1',
  conversationId: 'conv_1',
  senderId: 'usr_2',
  senderName: 'Sarah Johnson',
  body: 'Hi! Are we still on for the meeting tomorrow?',
  timestamp: new Date(now - 1000 * 60 * 30).toISOString()
},
{
  id: 'm1_2',
  conversationId: 'conv_1',
  senderId: 'usr_admin_1',
  senderName: 'Admin User',
  body: 'Yes, 2pm in the main conference room.',
  timestamp: new Date(now - 1000 * 60 * 25).toISOString()
},
{
  id: 'm1_3',
  conversationId: 'conv_1',
  senderId: 'usr_2',
  senderName: 'Sarah Johnson',
  body: 'Perfect. Should I bring the volunteer reports?',
  timestamp: new Date(now - 1000 * 60 * 20).toISOString()
},
{
  id: 'm1_4',
  conversationId: 'conv_1',
  senderId: 'usr_admin_1',
  senderName: 'Admin User',
  body: 'Yes please. The Q1 summary would be especially helpful.',
  timestamp: new Date(now - 1000 * 60 * 15).toISOString()
},
{
  id: 'm1_5',
  conversationId: 'conv_1',
  senderId: 'usr_2',
  senderName: 'Sarah Johnson',
  body: 'Sounds good, see you then!',
  timestamp: new Date(now - 1000 * 60 * 10).toISOString()
},
// Conv 2
{
  id: 'm2_1',
  conversationId: 'conv_2',
  senderId: 'usr_3',
  senderName: 'Marcus Chen',
  body: 'Hey, got a minute?',
  timestamp: new Date(now - 1000 * 60 * 60 * 4).toISOString()
},
{
  id: 'm2_2',
  conversationId: 'conv_2',
  senderId: 'usr_admin_1',
  senderName: 'Admin User',
  body: "Sure, what's up?",
  timestamp: new Date(now - 1000 * 60 * 60 * 3.8).toISOString()
},
{
  id: 'm2_3',
  conversationId: 'conv_2',
  senderId: 'usr_3',
  senderName: 'Marcus Chen',
  body: 'Can you review the schedule?',
  timestamp: new Date(now - 1000 * 60 * 60 * 3).toISOString()
},
// Conv 3
{
  id: 'm3_1',
  conversationId: 'conv_3',
  senderId: 'usr_admin_1',
  senderName: 'Admin User',
  body: 'Hi Emily, I wanted to update you on your application.',
  timestamp: new Date(now - 1000 * 60 * 60 * 26).toISOString()
},
{
  id: 'm3_2',
  conversationId: 'conv_3',
  senderId: 'usr_4',
  senderName: 'Emily Rodriguez',
  body: "Oh great, what's the status?",
  timestamp: new Date(now - 1000 * 60 * 60 * 25.5).toISOString()
},
{
  id: 'm3_3',
  conversationId: 'conv_3',
  senderId: 'usr_admin_1',
  senderName: 'Admin User',
  body: "You've been approved for the Mentor role!",
  timestamp: new Date(now - 1000 * 60 * 60 * 25).toISOString()
},
{
  id: 'm3_4',
  conversationId: 'conv_3',
  senderId: 'usr_4',
  senderName: 'Emily Rodriguez',
  body: 'Thanks for the update!',
  timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString()
}];