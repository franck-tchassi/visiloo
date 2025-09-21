'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, MapPin, Loader2, Calendar, ExternalLink, Building, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchSession {
  id: string;
  sessionId: string;
  keyword: string;
  city: string;
  createdAt: string;
  generatedLink: string;
}

// Nouveau composant pour une ligne de session de recherche
interface SessionRowProps {
  session: SearchSession;
  handleRowClick: (session: SearchSession) => void;
  handleDeleteSession: (sessionId: string) => Promise<void>;
  isClient: boolean;
  currentOrganizationId?: string | null;
}

const SessionRow: React.FC<SessionRowProps> = ({
  session,
  handleRowClick,
  handleDeleteSession,
  isClient,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false); // État local pour chaque Popover

  return (
    <TableRow
      key={session.sessionId}
      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <TableCell className="font-medium cursor-pointer"
        onClick={() => handleRowClick(session)}
      >
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
          {session.sessionId}<ExternalLink className="h-3 w-3" />
        </div>
      </TableCell><TableCell>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {session.keyword}
        </Badge>
      </TableCell><TableCell>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3" />
          {new Date(session.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </TableCell>{!isClient ? null : (<TableCell className="text-right">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}> {/* Utilise l'état local du Popover */}
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-fit p-2"> {/* Ajustement de la taille du Popover */}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Êtes-vous sûr ?
            </p>
            <div className="flex justify-end mt-2 text-sm"> {/* Espacement ajusté */}
              <Button variant="outline" onClick={() => setPopoverOpen(false)} className="mr-2 h-7 px-3 text-xs">Annuler</Button> {/* Taille de bouton ajustée */}
              <Button
                variant="destructive"
                onClick={async () => {
                  await handleDeleteSession(session.id); // Appelle la suppression
                  setPopoverOpen(false); // Ferme le Popover après la suppression
                }}
                className="h-7 px-3 text-xs"
              >Supprimer</Button>
            </div>
          </PopoverContent>
        </Popover>
      </TableCell>)}
    </TableRow>
  );
};

const LeadsPage = () => {
  const router = useRouter();
  const [activitySector, setActivitySector] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchSession[]>([]);
  const [isClient, setIsClient] = useState(false); // État pour le rendu côté client

  const queryClient = useQueryClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Utiliser TanStack Query pour récupérer l'utilisateur actuel et son currentOrganizationId
  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/users/current');
      if (!response.ok) {
        throw new Error('Échec de la récupération des données utilisateur');
      }
      return response.json();
    },
  });

  const currentOrganizationId = userData?.currentOrganizationId;

  // Nouvelle requête TanStack Query pour récupérer les sessions de recherche existantes
  const { data: existingSessions, isLoading: isSessionsLoading, isError: isSessionsError } = useQuery({
    queryKey: ['searchSessions', currentOrganizationId], // La clé dépend de l'organisation actuelle
    queryFn: async () => {
      if (!currentOrganizationId) return []; // Ne pas lancer la requête si pas d'organisation
      const response = await fetch('/api/organizations/current/search-sessions');
      if (!response.ok) {
        throw new Error('Échec de la récupération des sessions de recherche');
      }
      return response.json();
    },
    enabled: !!currentOrganizationId, // Activer la requête seulement si currentOrganizationId est défini
  });

  // Mettre à jour searchResults lorsque les sessions existantes sont chargées
  useEffect(() => {
    if (existingSessions) {
      setSearchResults(existingSessions);
    }
  }, [existingSessions]);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const handleDiscoverLeads = async () => {
    setIsLoading(true);

    if (isUserLoading || isUserError || isSessionsLoading || isSessionsError) {
      console.error("Chargement des données en cours ou erreur.");
      setIsLoading(false);
      return;
    }

    if (!currentOrganizationId) {
      console.error("Aucune organisation sélectionnée. Impossible de sauvegarder la session de recherche.");
      setIsLoading(false);
      return;
    }

    const sessionId = `SESSION-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newSearchSession: SearchSession = {
      id: sessionId, // Assurez-vous d'attribuer un ID unique pour la nouvelle session
      sessionId: sessionId,
      keyword: activitySector,
      city: city,
      createdAt: new Date().toISOString(), // Utiliser ISO string pour la cohérence avec la BD
      generatedLink: `/dashboard/leads/${slugify(activitySector)}/${sessionId}?city=${encodeURIComponent(city)}`,
    };

    try {
      const response = await fetch('/api/organizations/current/search-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: currentOrganizationId,
          searchSession: newSearchSession,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la sauvegarde de la session de recherche');
      }

      // Invalider le cache de TanStack Query pour forcer le re-fetch des sessions de recherche
      queryClient.invalidateQueries({ queryKey: ['searchSessions', currentOrganizationId] });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la session de recherche:", error);
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!currentOrganizationId) {
      console.error("Aucune organisation sélectionnée. Impossible de supprimer la session de recherche.");
      return;
    }

    try {
      const response = await fetch(`/api/organizations/current/search-sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId: currentOrganizationId }), // Passer l'ID de l'organisation pour la vérification
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la suppression de la session de recherche');
      }

      queryClient.invalidateQueries({ queryKey: ['searchSessions', currentOrganizationId] }); // Invalider pour recharger la liste
    } catch (error) {
      console.error("Erreur lors de la suppression de la session de recherche:", error);
      // Gérer l'affichage d'un message d'erreur à l'utilisateur
    }
  };

  const handleRowClick = (session: SearchSession) => {
    router.push(session.generatedLink);
  };

  // Afficher un état de chargement global pour les données utilisateur
  if (isUserLoading || isSessionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Chargement des données...</p>
      </div>
    );
  }

  // Afficher un état d'erreur global pour les données utilisateur
  if (isUserError || isSessionsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-red-500 dark:text-red-400">Erreur lors du chargement des données.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10 tracking-tight leading-tight">
        Découvrez des clients potentiels
      </h1>

      {/* Formulaire de recherche */}
      <Card className="w-full max-w-4xl mb-10">
        <CardHeader>
          <CardTitle>Recherche de prospects</CardTitle>

        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4 w-full">
            <div className="flex-1 min-w-0">
              <label htmlFor="activitySector" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">*Secteur d'activité:</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Input
                  type="text"
                  id="activitySector"
                  placeholder="Dentiste"
                  className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-base"
                  value={activitySector}
                  onChange={(e) => setActivitySector(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">*Ville:</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Input
                  type="text"
                  id="city"
                  placeholder="Lyon"
                  className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-base"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={handleDiscoverLeads}
              disabled={isLoading || !activitySector || !city}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-base flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-5 w-5" />
              )}
              Découvrir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section des résultats */}
      <Card className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Sessions de recherche
          </CardTitle>
          <CardDescription>
            {searchResults.length > 0
              ? `${searchResults.length} session(s) trouvée(s)`
              : "Aucune session de recherche pour le moment"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="font-semibold w-[150px]">ID Session</TableHead><TableHead className="font-semibold">Mot-clé (Secteur)</TableHead><TableHead className="font-semibold flex items-center gap-1"><Calendar className="h-4 w-4" />Créé le</TableHead>{isClient && <TableHead className="font-semibold text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.length > 0 ? (
                  searchResults.map((session) => (
                    <SessionRow
                      key={session.sessionId}
                      session={session}
                      handleRowClick={handleRowClick}
                      handleDeleteSession={handleDeleteSession}
                      isClient={isClient}
                      currentOrganizationId={currentOrganizationId}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isClient ? 4 : 3} className="h-24 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4">
                          <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune session trouvée</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                          Effectuez une recherche ci-dessus pour démarrer une nouvelle session.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page 1 sur 1
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" className="cursor-not-allowed opacity-50" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" className="cursor-not-allowed opacity-50" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsPage;