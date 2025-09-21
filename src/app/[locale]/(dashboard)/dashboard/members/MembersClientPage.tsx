'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Plus, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Member {
    id: string;
    userId: string;
    organizationId: string;
    role: 'USER' | 'MEMBER' | 'ADMIN';
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
    createdAt: Date; // Ajouté pour la date d'adhésion
}

interface Invitation {
    id: string;
    email: string;
    organizationId: string;
    role: 'USER' | 'MEMBER' | 'ADMIN';
    token: string;
    expiresAt: Date;
    createdAt: Date;
    organization: { name: string };
}

interface MembersClientPageProps {
    initialMembers: Member[];
    initialTotalMembers: number;
    initialInvitations: Invitation[];
    initialTotalInvitations: number;
    currentUserRole: 'USER' | 'MEMBER' | 'ADMIN';
    currentOrganizationId: string;
}

export function MembersClientPage({
    initialMembers,
    initialTotalMembers,
    initialInvitations,
    initialTotalInvitations,
    currentUserRole,
    currentOrganizationId,
}: MembersClientPageProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
    const [members, setMembers] = useState<Member[]>(initialMembers.map(member => ({ ...member, createdAt: new Date(member.createdAt) })));
    const [totalMembers, setTotalMembers] = useState(initialTotalMembers);
    const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations.map(invitation => ({ ...invitation, createdAt: new Date(invitation.createdAt), expiresAt: new Date(invitation.expiresAt) })));
    const [totalInvitations, setTotalInvitations] = useState(initialTotalInvitations);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
    const [isSendingInvitation, setIsSendingInvitation] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);

    // Supprimé: refreshData (car les données viennent des props et sont rechargées par router.refresh())

    const handleSendInvitation = async () => {
        setInviteError(null);
        setIsSendingInvitation(true);
        try {
            const response = await fetch('/api/organizations/current/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Échec de l\'envoi de l\'invitation');
            }

            setInviteEmail('');
            setInviteRole('MEMBER');
            setShowInviteDialog(false);
            router.refresh(); // Déclenche un re-render du Server Component parent pour actualiser les données
        } catch (err: any) {
            console.error('Erreur lors de l\'envoi de l\'invitation:', err);
            setInviteError(err.message);
        } finally {
            setIsSendingInvitation(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Membres</h1>
                {(currentUserRole === 'ADMIN' || currentUserRole === 'MEMBER') && (
                    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Inviter
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Inviter un membre</DialogTitle>
                                <DialogDescription>
                                    Envoyez une invitation par e-mail pour rejoindre cette organisation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="role" className="text-right">
                                        Accès
                                    </Label>
                                    <Select value={inviteRole} onValueChange={(value: 'MEMBER' | 'ADMIN') => setInviteRole(value)}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Sélectionner un rôle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MEMBER">Membre</SelectItem>
                                            <SelectItem value="ADMIN">Administrateur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {inviteError && <p className="text-red-500 text-sm col-span-full text-center">{inviteError}</p>}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowInviteDialog(false)} disabled={isSendingInvitation}>Annuler</Button>
                                <Button onClick={handleSendInvitation} disabled={isSendingInvitation}>
                                    {isSendingInvitation ? 'Envoi...' : 'Envoyer l\'invitation'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="flex space-x-2">
                <Button
                    variant={activeTab === 'members' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('members')}
                >
                    Tous ({totalMembers})
                </Button>
                <Button
                    variant={activeTab === 'invitations' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('invitations')}
                >
                    Invitations ({totalInvitations})
                </Button>
            </div>

            {activeTab === 'members' && (
                members.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Accès</TableHead>
                                <TableHead>A rejoint</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={member.user.image || undefined} alt={member.user.name || 'User'} />
                                            <AvatarFallback>{member.user.name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{member.user.name}</p>
                                            <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell>{format(member.createdAt, 'dd/MM/yyyy')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <EmptyState icon={<UserX className="h-12 w-12 text-gray-400" />} message="Aucun membre trouvé." />
                )
            )}

            {activeTab === 'invitations' && (
                invitations.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>E-mail</TableHead>
                                <TableHead>Accès</TableHead>
                                <TableHead>Invité</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invitations.map((invitation) => (
                                <TableRow key={invitation.id}>
                                    <TableCell>{invitation.email}</TableCell>
                                    <TableCell>{invitation.role}</TableCell>
                                    <TableCell>{format(invitation.createdAt, 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>
                                        {invitation.expiresAt > new Date() ? (
                                            <span className="text-green-500">En attente</span>
                                        ) : (
                                            <span className="text-red-500">Expirée</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <EmptyState icon={<CalendarIcon className="h-12 w-12 text-gray-400" />} message="Aucune invitation en attente." />
                )
            )}
        </div>
    );
}

// Composant pour afficher un état vide
const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({ icon, message }) => (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md text-gray-500 bg-gray-50">
        {icon}
        <p className="mt-4 text-lg font-medium">{message}</p>
    </div>
);
