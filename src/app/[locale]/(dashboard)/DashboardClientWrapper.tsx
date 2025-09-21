'use client';

import React, { useState, useEffect } from "react";
import { SearchOverlay } from "@/components/search-overlay";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface DashboardClientWrapperProps {
    children: React.ReactNode;
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);
    const capitalizeFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const locales = ['en', 'fr', 'de', 'it', 'pt', 'es']; // Liste des langues prises en charge
    const filteredPathSegments = pathSegments.filter(segment => !locales.includes(segment));

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSearchClick = () => {
        setShowSearchOverlay(true);
    };

    const handleCloseSearchOverlay = () => {
        setShowSearchOverlay(false);
    };

    if (!isClient) {
        return null; // Rendre rien côté serveur pour éviter les problèmes d'hydratation
    }

    return (
        <div className="flex flex-1 flex-col bg-gradient-to-br from-background via-card to-background">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <Breadcrumb className="px-4 lg:px-6">
                        <BreadcrumbList>
                            {filteredPathSegments.map((segment, index) => {
                                const href = '/' + filteredPathSegments.slice(0, index + 1).join('/');
                                const isLast = index === filteredPathSegments.length - 1;
                                const displaySegment = segment.replace(/%20/g, ' ').split('-').map(capitalizeFirstLetter).join(' ');

                                return (
                                    <React.Fragment key={segment}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>{displaySegment}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={href}>{displaySegment}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
            <SearchOverlay isOpen={showSearchOverlay} onClose={handleCloseSearchOverlay} />
        </div>
    );
}
