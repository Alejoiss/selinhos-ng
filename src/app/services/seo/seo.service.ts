import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeoService {
    private defaultTitle = 'Selo Clube - fidelidade que vira coleção';
    private defaultDescription = 'Acumule selos digitais, troque com amigos e ganhe recompensas nos seus estabelecimentos favoritos.';
    private defaultImage = '/assets/images/login-image.jpg';

    constructor(
        private title: Title,
        private meta: Meta,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Update SEO on navigation
        this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
            const deepest = this.getDeepestRoute(this.route);
            const data = (deepest && deepest.snapshot && deepest.snapshot.data) || {};

            const title = (data['title'] as string) || this.defaultTitle;
            const description = (data['description'] as string) || this.defaultDescription;
            const image = (data['image'] as string) || this.defaultImage;
            const url = window.location.href;

            this.updateTags({ title, description, image, url, structuredData: data['structuredData'] });
        });
    }

    private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    }

    updateTags(opts: { title: string; description: string; image?: string; url?: string; structuredData?: any; }) {
        const { title, description, image, url, structuredData } = opts;

        // Title & description
        this.title.setTitle(title);
        this.meta.updateTag({ name: 'description', content: description });

        // Open Graph
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: image || this.defaultImage });
        this.meta.updateTag({ property: 'og:url', content: url || window.location.href });

        // Twitter
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image || this.defaultImage });

        // canonical
        this.setCanonical(url || window.location.href);

        // JSON-LD structured data
        this.setStructuredData(structuredData || (this.isHomepage(url) ? this.organizationStructuredData() : null));
    }

    private setCanonical(url: string) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    private setStructuredData(obj: any | null) {
        const id = 'seo-json-ld';
        let script = document.getElementById(id) as HTMLScriptElement | null;
        if (obj) {
            if (!script) {
                script = document.createElement('script');
                script.type = 'application/ld+json';
                script.id = id;
                document.head.appendChild(script);
            }
            script.text = JSON.stringify(obj);
        } else if (script) {
            script.remove();
        }
    }

    private isHomepage(url?: string): boolean {
        const u = (url || window.location.href).replace(window.location.origin, '');
        return u === '/' || u === '';
    }

    private organizationStructuredData() {
        const origin = window.location.origin;
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Selo Clube',
            url: origin,
            logo: origin + this.defaultImage,
            sameAs: []
        };
    }
}
