import { Component } from '@angular/core';
import { Transaction, TransactionSummary } from 'src/app/model/transaction.model';
import { CsvUploadService } from 'src/app/services/csv-upload.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'csv-viewer-app';
  transactions: Transaction[] = [];
  summary!: TransactionSummary;
  issuesTransactions: Transaction[] = [];
  paginatedTransactions$ = this.csvService.paginatedTransactions$;

  constructor(private csvService: CsvUploadService) { }
  loading = false;
  error: string | null = null;
  activeTab: 'transactions' | 'issues' = 'transactions';
  ngOnInit() {
    this.csvService.getAllTransactions().subscribe();

    this.csvService.transactions$.subscribe(data => {
      this.transactions = data || [];
    });
    this.csvService.issues$.subscribe(data => {
      this.issuesTransactions = data
    });
    this.csvService.loading$.subscribe(val => {
      this.loading = val;
    });
    this.csvService.error$.subscribe(err => {
      this.error = err;
    });
  }
}
