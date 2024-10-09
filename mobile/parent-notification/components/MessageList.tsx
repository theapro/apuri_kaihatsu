import {Message} from "@/constants/types";
import {RefreshControl, ScrollView, View} from "react-native";
import Card from "@/components/card";
import {Separator} from "@/components/atomic/separator";
import React, {useContext} from "react";
import Button from "@/components/atomic/button";
import {ThemedText} from "@/components/ThemedText";
import {I18nContext} from "@/contexts/i18n-context";

interface MessageListProps {
  messages: Message[];
  refreshing: boolean;
  onRefresh: () => void;
  loadMoreMessages: () => void;
  loadingMore: boolean;
}

export const MessageList: React.FC<MessageListProps> = React.memo(({
                                                                     messages,
                                                                     refreshing,
                                                                     onRefresh,
                                                                     loadMoreMessages,
                                                                     loadingMore
                                                                   }) => {
  const {language, i18n} = useContext(I18nContext);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      contentContainerStyle={{paddingBottom: 80}}
    >
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          <Card message={message}/>
          <Separator orientation="horizontal"/>
        </React.Fragment>
      ))}
      <View style={{padding: 10}}>
        {loadingMore ? (
          <ThemedText>Loading more...</ThemedText>
        ) : (
          <Button title={i18n[language].loadMoreMessages} onPress={loadMoreMessages}/>
        )}
      </View>
    </ScrollView>
  );
});
