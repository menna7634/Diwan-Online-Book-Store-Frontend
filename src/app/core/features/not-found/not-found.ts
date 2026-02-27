import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-light flex flex-col items-center justify-center gap-6 text-center px-4">
      <h1 class="text-9xl font-extrabold text-primary">404</h1>
      <h2 class="text-2xl font-bold text-textMain">Page Not Found</h2>
      <p class="text-textSub max-w-sm">Looks like this page went missing from our shelves.</p>
      <a routerLink="/" class="bg-primary text-white px-8 py-3 rounded-full font-bold no-underline hover:bg-primaryHover transition-all">
        Back to Home
      </a>
    </div>
  `
})
export class NotFoundComponent {}