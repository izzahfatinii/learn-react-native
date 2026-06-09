import { IconSymbol } from '@/components/ui/icon-symbol';
// import { askGenAI } from '@/services/gen-ai.service';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey! How is the new app coming along?', sender: 'them', timestamp: '10:00 AM' },
    { id: '2', text: 'Going great! Just finished rebuilding the layout for the chat screen.', sender: 'me', timestamp: '10:01 AM' },
    { id: '3', text: 'Awesome, does it support auto-scrolling to new messages?', sender: 'them', timestamp: '10:02 AM' },
    { id: '4', text: 'Yep, about to test that right now! 🚀', sender: 'me', timestamp: '10:02 AM' },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    addChat({ sender: 'me', message: inputText });

    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // call to ask genAI
    setIsTyping(true);
    // sendChatToGenAI(inputText)
    //   .then((reply) => {
    //     setIsTyping(false);
    //     addChat({ sender: 'them', message: reply ?? 'Please try again' });
    //   }) 
    //   .catch((error) => console.error(error));
  };

//   const sendChatToGenAI = (message: string) => askGenAI(message);

  const addChat = ({
    sender, 
    message 
  }: { sender: 'me' | 'them'; message: string}
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';

    return (
      // Message row wrapper
      <View className={`flex-row mb-3 w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
        {/* Message Bubble */}
        <View 
          className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-sm elevation-1
            ${isMe ? 'bg-blue-500 rounded-br-sm' : 'bg-white rounded-bl-sm'}`}
        >
          {/* Text */}
          <Text className={`text-base leading-5 ${isMe ? 'color-white' : 'color-gray-800'}`}>
            {item.text}
          </Text>
          
          {/* Timestamp */}
          <Text className={`text-[10px] mt-1 self-end ${isMe ? 'color-blue-100/70' : 'color-gray-400'}`}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}

          // 3. Footer component inserts the loading indicator at the bottom of the list
          ListFooterComponent={() => (
            isTyping ? (
              <View className="flex-row mb-3 w-full justify-start">
                <View className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm elevation-1 flex-row items-center space-x-1">
                  {/* Modern three-dot typing bounce simulation */}
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse opacity-60" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse opacity-30" />
                </View>
              </View>
            ) : null
          )}
        />

        {/* Bottom Input Bar */}
        <View className="flex-row px-3 py-2 bg-white items-center border-t border-gray-200">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 text-base max-h-24 color-gray-800"
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af" // Tailwind gray-400
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <TouchableOpacity 
            className={`w-9 h-9 rounded-full justify-center items-center 
              ${inputText.trim() ? 'bg-blue-500' : 'bg-blue-200'}`}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <IconSymbol size={18} name="paperplane.fill" color={'white'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}