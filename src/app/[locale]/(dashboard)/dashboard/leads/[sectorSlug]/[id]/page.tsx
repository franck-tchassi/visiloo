'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2, Star, Phone, Globe, MapPin, Building, Calendar, Mail, Search, Download } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"; // Assurez-vous que ce bouton est importé

interface LeadDetails {
    id: string;
    nom: string;
    adresse: string;
    note?: number | null;
    nombreAvis?: number;
    telephone?: string | null;
    siteWeb?: string | null;
    lienMaps?: string;
    // Ajoutez d'autres champs que vous souhaitez afficher
}

const LeadResultsPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const { sectorSlug, id } = params; // id est maintenant le sessionId
    const city = searchParams.get('city') || 'inconnue'; // Fournir une valeur par défaut

    const [leads, setLeads] = useState<LeadDetails[]>([]); // Maintenant stocke tous les leads récupérés
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displaySectorSlug, setDisplaySectorSlug] = useState<string>('');

    // États pour la pagination côté client
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Nombre de leads affichés par page côté client
    const [nextPageToken, setNextPageToken] = useState<string | null>(null); // Jeton pour la prochaine page Google

    // Fonctions de téléchargement
    const downloadJson = () => {
        const filename = `leads_${displaySectorSlug}_${city}.json`;
        const jsonStr = JSON.stringify(leads, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const downloadCsv = () => {
        const filename = `leads_${displaySectorSlug}_${city}.csv`;
        const headers = ["Nom", "Adresse", "Note", "Nombre Avis", "Téléphone", "Site Web", "Lien Maps"];
        const csvRows = leads.map(lead => [
            `"${lead.nom.replace(/"/g, '""')}"`,
            `"${lead.adresse.replace(/"/g, '""')}"`,
            lead.note ?? '',
            lead.nombreAvis ?? '',
            `"${lead.telephone ? lead.telephone.replace(/"/g, '""') : ''}"`,
            `"${lead.siteWeb ? lead.siteWeb.replace(/"/g, '""') : ''}"`,
            `"${lead.lienMaps ? lead.lienMaps.replace(/"/g, '""') : ''}"`,
        ].join(','));

        const csvStr = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const downloadPdf = () => {
        // Pour une solution client-side simple, utiliser l'impression du navigateur
        // Cela imprimera le contenu actuel de la page, y compris le tableau.
        window.print();
    };

    // Fonction pour charger les leads, mémorisée avec useCallback
    const fetchLeadsForSession = useCallback(async (token: string | null = null) => {
        // Assurez-vous que sectorSlug est une chaîne de caractères
        const processedSectorSlug = Array.isArray(sectorSlug) ? sectorSlug[0] : sectorSlug;
        setDisplaySectorSlug(processedSectorSlug || ''); // Mettre à jour l'état

        if (!processedSectorSlug || !city) {
            setError("Secteur d'activité ou ville manquante.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            // Appel à l'API /api/search avec le secteur et la ville
            // Utiliser le pageToken si fourni
            let url = `/api/search?query=${encodeURIComponent(`${decodeURIComponent(processedSectorSlug)} ${city}`)}`;
            if (token) {
                url += `&pageToken=${token}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setLeads((prevLeads) => {
                    const newLeads = data.results.filter((newLead: LeadDetails) =>
                        !prevLeads.some(existingLead => existingLead.id === newLead.id)
                    );
                    return [...prevLeads, ...newLeads];
                });
                setNextPageToken(data.nextPageToken); // Mettre à jour le jeton pour la prochaine page
            } else {
                setError(data.error || "Erreur lors de la récupération des leads.");
            }
        } catch (err) {
            console.error("Erreur de l'API de recherche:", err);
            setError("Impossible de charger les leads pour cette session.");
        } finally {
            setIsLoading(false);
        }
    }, [sectorSlug, city]); // Dépendances de useCallback

    useEffect(() => {
        // Réinitialiser les leads et le pageToken lors du changement de session
        setLeads([]);
        setNextPageToken(null);
        setCurrentPage(1);
        fetchLeadsForSession(); // Appel initial au montage
    }, [fetchLeadsForSession]); // Dépendance de useEffect

    if (isLoading && leads.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">Chargement des leads...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-red-600 dark:text-red-400">
                <p className="text-xl font-bold">Erreur:</p>
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    // Logique de pagination côté client
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLeads = leads.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(leads.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // Fonction pour charger plus de résultats de l'API Google
    const loadMoreLeads = () => {
        if (nextPageToken) {
            fetchLeadsForSession(nextPageToken);
            // Après avoir chargé plus de leads, la page actuelle ne change pas forcément immédiatement,
            // car les nouveaux leads sont ajoutés à la fin du tableau `leads`. L'interface utilisateur
            // de la pagination se mettra à jour en fonction de `leads.length`.
            // Si l'on veut automatiquement passer à la première nouvelle page de résultats:
            // setCurrentPage(totalPages + 1);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full">
                <CardHeader className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Résultats pour &quot;{decodeURIComponent(displaySectorSlug)}&quot; à &quot;{city}&quot;
                        </CardTitle>
                        <CardDescription>
                            {leads.length > 0
                                ? `${leads.length} entreprise(s) trouvée(s)`
                                : "Aucune entreprise trouvée pour cette session."}
                        </CardDescription>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Exporter
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2">
                            <div className="grid gap-1">
                                <Button variant="ghost" className="justify-start" onClick={downloadJson}>Télécharger JSON</Button>
                                <Button variant="ghost" className="justify-start" onClick={downloadCsv}>Télécharger CSV</Button>
                                <Button variant="ghost" className="justify-start" onClick={downloadPdf}>Télécharger PDF</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardHeader>
                <CardContent>
                    {leads.length > 0 ? (
                        <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-700">
                                    <TableRow>
                                        <TableHead className="font-semibold">Nom établissement</TableHead>
                                        <TableHead className="font-semibold">Note</TableHead>
                                        <TableHead className="font-semibold">Avis</TableHead>
                                        <TableHead className="font-semibold">Téléphone</TableHead>
                                        <TableHead className="font-semibold">Site Web</TableHead>
                                        <TableHead className="font-semibold">Adresse</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentLeads.map((lead) => (
                                        <TableRow key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <TableCell className="font-medium">
                                                <a href={lead.lienMaps} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                                                    <Building className="h-4 w-4" />
                                                    {lead.nom}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                {lead.note ? (
                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-current" /> {lead.note}
                                                    </Badge>
                                                ) : 'N/A'}
                                            </TableCell>
                                            <TableCell>{lead.nombreAvis ?? 0}</TableCell>
                                            <TableCell>
                                                {lead.telephone ? (
                                                    <a href={`tel:${lead.telephone}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                                        <Phone className="h-3 w-3" /> {lead.telephone}
                                                    </a>
                                                ) : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {lead.siteWeb ? (
                                                    <a href={lead.siteWeb} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                                        <Globe className="h-3 w-3" /> Site
                                                    </a>
                                                ) : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400" /> {lead.adresse}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4">
                                <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun lead trouvé</h3>
                            <p className="max-w-md text-center">
                                Il n'y a pas de leads pour cette session de recherche. Essayez une autre combinaison.
                            </p>
                        </div>
                    )}
                    {(leads.length > 0 || nextPageToken) && (
                        <div className="mt-4 flex items-center justify-between">
                            {leads.length > 0 && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Page {currentPage} sur {totalPages}
                                </div>
                            )}
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className={currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                href="#"
                                                isActive={index + 1 === currentPage}
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className={currentPage === totalPages && !nextPageToken ? "cursor-not-allowed opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                    {nextPageToken && (
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                onClick={isLoading ? (e) => e.preventDefault() : loadMoreLeads}
                                                className={`ml-2 bg-blue-500 hover:bg-blue-600 text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Charger plus
                                            </PaginationLink>
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default LeadResultsPage;