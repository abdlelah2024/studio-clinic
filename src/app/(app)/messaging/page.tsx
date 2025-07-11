
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { User, Message } from "@/lib/types";
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/app-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function MessagingPage() {
    const { users, messages, loading, addMessage, currentUser } = useAppContext();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherUsers = users.filter(u => u.email !== currentUser?.email);
    
    useEffect(() => {
        if (!selectedUser && otherUsers.length > 0) {
            setSelectedUser(otherUsers[0]);
        }
    }, [users, selectedUser, otherUsers]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, selectedUser]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedUser && currentUser) {
            addMessage({
                senderEmail: currentUser.email,
                receiverEmail: selectedUser.email,
                text: newMessage,
            });
            setNewMessage("");
        }
    };

    const conversation = selectedUser ? messages.filter(
        m => (m.senderEmail === currentUser?.email && m.receiverEmail === selectedUser.email) ||
             (m.senderEmail === selectedUser.email && m.receiverEmail === currentUser?.email)
    ).sort((a,b) => (a.timestamp && b.timestamp) ? (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : 0) : [];


    if (loading) {
        return (
            <Card className="h-[calc(100vh-10rem)] flex">
                <div className="w-1/3 border-r flex flex-col">
                   <div className="p-4"><Skeleton className="h-8 w-3/4" /></div>
                   <div className="flex-1 p-2 space-y-2">
                       <Skeleton className="h-16 w-full" />
                       <Skeleton className="h-16 w-full" />
                       <Skeleton className="h-16 w-full" />
                   </div>
                </div>
                <div className="w-2/3 flex items-center justify-center">
                     <p>جاري التحميل...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="h-[calc(100vh-10rem)] flex">
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">المحادثات</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {otherUsers.map(user => (
                        <div
                            key={user.email}
                            className={cn(
                                "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50",
                                selectedUser?.email === user.email && "bg-muted"
                            )}
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="relative">
                                <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className={cn(
                                    "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-background",
                                    user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                )} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{user.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-2/3 flex flex-col">
                {selectedUser && currentUser ? (
                    <>
                        <div className="p-4 border-b flex items-center gap-3">
                             <div className="relative">
                                <Avatar>
                                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} data-ai-hint="person face" />
                                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                 <span className={cn(
                                    "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-card",
                                    selectedUser.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                )} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedUser.status === 'online' ? 'متصل' : 'غير متصل'}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                           {conversation.length === 0 && (
                                <div className="text-center text-muted-foreground pt-10">
                                    لا توجد رسائل. ابدأ المحادثة.
                                </div>
                           )}
                            {conversation.map(message => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex items-end gap-2",
                                        message.senderEmail === currentUser.email ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {message.senderEmail !== currentUser.email && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={selectedUser.avatar} data-ai-hint="person face" />
                                            <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-xs rounded-lg p-3",
                                            message.senderEmail === currentUser.email
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted rounded-bl-none"
                                        )}
                                    >
                                        <p>{message.text}</p>
                                        <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    {message.senderEmail === currentUser.email && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={currentUser.avatar} data-ai-hint="person face" />
                                            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t">
                            <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                                <Input
                                    placeholder="اكتب رسالتك..."
                                    className="flex-1"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <p>اختر محادثة لبدء المراسلة.</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

    