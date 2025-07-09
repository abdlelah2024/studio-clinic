
"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAuditLogs } from "@/lib/data";
import type { AuditLog, AuditLogAction, AuditLogCategory } from "@/lib/types";
import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Search, ListFilter, ArrowUpDown, History, User, Stethoscope, Calendar, FileText, Bot, Pencil, Trash2, XCircle, LogIn } from "lucide-react";
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type SortKey = 'date-asc' | 'date-desc';

const getCategoryTranslation = (category: AuditLogCategory) => {
    switch (category) {
        case 'Patient': return 'مريض';
        case 'Doctor': return 'طبيب';
        case 'Appointment': return 'موعد';
        case 'User': return 'مستخدم';
        case 'System': return 'نظام';
        case 'Report': return 'تقرير';
        default: return category;
    }
}

const getActionTranslation = (action: AuditLogAction) => {
    switch (action) {
        case 'Create': return 'إنشاء';
        case 'Update': return 'تحديث';
        case 'Delete': return 'حذف';
        case 'Cancel': return 'إلغاء';
        case 'Login': return 'تسجيل دخول';
        default: return action;
    }
}

const getActionIcon = (action: AuditLogAction) => {
    switch (action) {
        case 'Create': return <Bot className="h-4 w-4 text-blue-500" />;
        case 'Update': return <Pencil className="h-4 w-4 text-yellow-500" />;
        case 'Delete': return <Trash2 className="h-4 w-4 text-red-500" />;
        case 'Cancel': return <XCircle className="h-4 w-4 text-gray-500" />;
        case 'Login': return <LogIn className="h-4 w-4 text-green-500" />;
        default: return <History className="h-4 w-4 text-muted-foreground" />;
    }
};

const getCategoryIcon = (category: AuditLogCategory) => {
    switch (category) {
        case 'Patient': return <User className="h-4 w-4" />;
        case 'Doctor': return <Stethoscope className="h-4 w-4" />;
        case 'Appointment': return <Calendar className="h-4 w-4" />;
        case 'User': return <User className="h-4 w-4" />;
        case 'System': return <History className="h-4 w-4" />;
        case 'Report': return <FileText className="h-4 w-4" />;
        default: return <History className="h-4 w-4" />;
    }
}

export default function AuditLogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState<AuditLogAction | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<AuditLogCategory | 'all'>('all');
    const [sortKey, setSortKey] = useState<SortKey>('date-desc');

    const filteredAndSortedLogs = useMemo(() => {
        const filtered = mockAuditLogs.filter(log => {
            const searchMatch = log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.details.toLowerCase().includes(searchQuery.toLowerCase());
            const actionMatch = actionFilter === 'all' || log.action === actionFilter;
            const categoryMatch = categoryFilter === 'all' || log.category === categoryFilter;

            return searchMatch && actionMatch && categoryMatch;
        });

        return filtered.sort((a, b) => {
            switch (sortKey) {
                case 'date-asc':
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                case 'date-desc':
                default:
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
        });
    }, [searchQuery, actionFilter, categoryFilter, sortKey]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>مراقبة التعديلات</CardTitle>
                        <CardDescription>عرض سجل بالتغييرات التي تم إجراؤها في النظام.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                            type="search"
                            placeholder="بحث بالتفاصيل أو المستخدم..."
                            className="w-full rounded-lg bg-background pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={actionFilter} onValueChange={(v) => setActionFilter(v as any)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="فلترة بالإجراء" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">كل الإجراءات</SelectItem>
                                <SelectItem value="Create">إنشاء</SelectItem>
                                <SelectItem value="Update">تحديث</SelectItem>
                                <SelectItem value="Delete">حذف</SelectItem>
                                <SelectItem value="Cancel">إلغاء</SelectItem>
                                <SelectItem value="Login">تسجيل دخول</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="فلترة بالقسم" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">كل الأقسام</SelectItem>
                                <SelectItem value="Patient">مريض</SelectItem>
                                <SelectItem value="Doctor">طبيب</SelectItem>
                                <SelectItem value="Appointment">موعد</SelectItem>
                                <SelectItem value="User">مستخدم</SelectItem>
                                <SelectItem value="Report">تقرير</SelectItem>
                                <SelectItem value="System">نظام</SelectItem>
                            </SelectContent>
                        </Select>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1">
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                    <span>تصنيف</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuCheckboxItem checked={sortKey === 'date-desc'} onSelect={() => setSortKey('date-desc')}>الأحدث أولاً</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={sortKey === 'date-asc'} onSelect={() => setSortKey('date-asc')}>الأقدم أولاً</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الإجراء</TableHead>
                            <TableHead>القسم</TableHead>
                            <TableHead>المستخدم</TableHead>
                            <TableHead>التفاصيل</TableHead>
                            <TableHead>الوقت</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedLogs.length > 0 ? (
                            filteredAndSortedLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getActionIcon(log.action)}
                                            <span>{getActionTranslation(log.action)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="gap-1.5 pl-1.5">
                                            {getCategoryIcon(log.category)}
                                            {getCategoryTranslation(log.category)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={log.user.avatar} data-ai-hint="person face" />
                                                <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{log.user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{log.details}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span title={format(new Date(log.timestamp), 'PPP p', { locale: ar })}>
                                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: ar })}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    لا توجد سجلات مطابقة.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
    
    