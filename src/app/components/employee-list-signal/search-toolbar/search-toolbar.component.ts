import { Component, EventEmitter, Input, Output } from '@angular/core';
import { APP_CONFIG } from 'src/app/config/app.config';

@Component({
  selector: 'filter-employee-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.scss'],
  standalone: false,
})
export class FilterToolbarComponent {

  @Input() searchQuery = '';
  @Input() selectedGroup = '';
  @Input() selectedStatus = '';

  departments = APP_CONFIG.departments;
  statuses = APP_CONFIG.statuses;

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() groupChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();

  onSearch() {
    this.searchQueryChange.emit(this.searchQuery);
  }

  onGroupChanged() {
    this.groupChange.emit(this.selectedGroup);
  }

  onStatusChanged() {
    this.statusChange.emit(this.selectedStatus);
  }

}