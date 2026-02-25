import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  imports: [NgClass, RouterModule],
  templateUrl: './admin-panel.layout.html',
})
export class AdminPanelLayout {
  isSidebarOpen = signal(true);

  toggleSidebar() {
    this.isSidebarOpen.update(b => !b);
  }
}
