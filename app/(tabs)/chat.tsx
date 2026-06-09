import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc'; // Import twrnc

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
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const value = useRef('value');
  const flatListRef = useRef<FlatList>(null);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const myMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, myMessage]);
    setInputText('');
    
    setIsTyping(true); 
    scrollToBottom();

    setTimeout(() => {
      setIsTyping(false); 
      
      const theirReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Haaai 🚀",
        sender: 'them',
        timestamp: formatTime(),
      };
      
      setMessages((prev) => [...prev, theirReply]);
      scrollToBottom();
    }, 2000); 
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';

    return (
      /* Message Row Wrapper */
      <View style={tw`flex-row mb-3 w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
        {/* Message Bubble */}
        <View 
          style={tw`max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-sm
            ${isMe ? 'bg-blue-500 rounded-br-none' : 'bg-white rounded-bl-none'}`}
        >
          {/* Text */}
          <Text style={tw`text-base leading-5 ${isMe ? 'text-white' : 'text-gray-800'}`}>
            {item.text}
          </Text>
          
          {/* Timestamp */}
          <Text style={tw`text-[10px] mt-1 self-end ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={tw`flex-1`}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={tw`px-4 py-3`} // twrnc handles mapping layout objects directly inside contentContainerStyle
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          
          ListFooterComponent={() => (
            isTyping ? (
              <View style={tw`flex-row mb-3 w-full justify-start`}>
                <View style={tw`bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex-row items-center`}>
                  <ActivityIndicator size="small" color="#9ca3af" style={tw`mr-2`} />
                  <Text style={tw`text-gray-400 text-sm`}>Typing...</Text>
                </View>
              </View>
            ) : null
          )}
        />

        {/* Bottom Input Bar */}
        <View style={tw`flex-row px-3 py-2 bg-white items-center border-t border-gray-200`}>
          <TextInput
            style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 text-base max-h-24 text-gray-800`}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <TouchableOpacity 
            style={tw`w-9 h-9 rounded-full justify-center items-center 
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