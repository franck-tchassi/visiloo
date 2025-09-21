'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query'; // Importer useQueryClient

interface Organization {
    id: string;
    name: string;
}

interface OrganizationSwitcherProps {
    organizations: Organization[];
    currentOrganizationId: string | null | undefined;
}

export function OrganizationSwitcher({
    organizations,
    currentOrganizationId,
}: OrganizationSwitcherProps) {
    const [open, setOpen] = React.useState(false);
    const [showNewOrganizationDialog, setShowNewOrganizationDialog] = React.useState(false);
    const [newOrganizationName, setNewOrganizationName] = React.useState('');

    const router = useRouter();
    const queryClient = useQueryClient(); // Obtenir l'instance du client de requête

    const currentOrganization = organizations.find(
        (org) => org.id === currentOrganizationId
    );

    const handleOrganizationChange = async (id: string) => {
        setOpen(false);

        try {
            const response = await fetch('/api/users/current-organization', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ organizationId: id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Échec de la mise à jour de l\'organisation active');
            }
            queryClient.invalidateQueries({ queryKey: ['currentUser'] }); // Invalider le cache pour currentUser
            router.refresh(); // Réintroduire router.refresh() pour re-rendre les Server Components
        } catch (err: any) {
            console.error('Erreur lors de la mise à jour de l\'organisation active:', err);
            // Display error to user
        }
    };

    const handleCreateOrganization = async () => {
        if (newOrganizationName.trim()) {
            try {
                const response = await fetch('/api/organizations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newOrganizationName.trim() }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Échec de la création de l\'organisation');
                }

                const newOrg = await response.json();

                await fetch('/api/users/current-organization', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ organizationId: newOrg.id }),
                });

                setNewOrganizationName('');
                setShowNewOrganizationDialog(false);
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ['currentUser'] }); // Invalider le cache pour currentUser
                router.refresh(); // Réintroduire router.refresh() pour re-rendre les Server Components
            } catch (err: any) {
                console.error('Erreur lors de la création de l\'organisation:', err);
            }
        }
    };

    return (
        <Dialog open={showNewOrganizationDialog} onOpenChange={setShowNewOrganizationDialog}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Sélectionner une organisation"
                        className={cn('w-[300px] justify-between cursor-pointer')}
                    >
                        {currentOrganization ? currentOrganization.name : 'Aucune organisation'}
                        {open ? <ChevronUp className="ml-auto h-4 w-4 shrink-0 opacity-50 cursor-pointer" /> : <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50 cursor-pointer" />}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Rechercher une organisation..." />
                            <CommandEmpty>Aucune organisation trouvée.</CommandEmpty>
                            <CommandGroup heading="Organisations">
                                {organizations.map((organization) => (
                                    <CommandItem
                                        key={organization.id}
                                        onSelect={() => {
                                            handleOrganizationChange(organization.id);
                                        }}
                                        className="text-sm cursor-pointer"
                                    >
                                        {organization.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <DialogTrigger asChild>
                                    <CommandItem
                                        onSelect={() => {
                                            setOpen(false);
                                            setShowNewOrganizationDialog(true);
                                        }}
                                        className='cursor-pointer'
                                    >
                                        <PlusCircle className="mr-2 h-5 w-5" />
                                        Créer une organisation
                                    </CommandItem>
                                </DialogTrigger>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Créer votre espace de travail</DialogTitle>
                    <DialogDescription>
                        Les espaces du travail organisent vos Profils d’entreprise. Donnez-lui un nom que vous reconnaîtrez. Et ne vous inquiétez pas, vous pouvez le changer à tout moment. Invitez vos coéquipiers pour un accès partagé plus tard.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="name" className="sr-only">
                        Nom de l'organisation
                    </Label>
                    <Input
                        id="name"
                        placeholder="Nom de l'organisation"
                        value={newOrganizationName}
                        onChange={(e) => setNewOrganizationName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewOrganizationDialog(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleCreateOrganization}>Créer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
