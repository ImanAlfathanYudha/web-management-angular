import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, finalize, forkJoin, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Transaction, TransactionSummary } from '../model/transaction.model';

const API_URL_UPLOAD_TRANSACTION = 'http://localhost:8800/api/v1/transaction/upload';
const API_URL_GET_TRANSACTION = 'http://localhost:8800/api/v1/transaction/balance'
const API_URL_GET_ISSUE = 'http://localhost:8800/api/v1/transaction/issues'
const API_URL_EDIT_TRANSACTION_SUCCESS = 'http://localhost:8800/api/v1/transaction/edit'
const API_URL_DETAIL_TRANSACTION = 'http://localhost:8800/api/v1/transaction/detail'
@Injectable({
  providedIn: 'root'
})
export class CsvUploadService {

  constructor(private http: HttpClient) { }

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);//Subject + punya current value. tempat nyimpen state + alat broadcast ke semua listener. Akan jadi pusat data stream
  //objek transaction di sini adalah total transaction yang berhasil aja
  transactions$ = this.transactionsSubject.asObservable();//transactions$ akan jadi data stream. versi read-only dari data (biar component cuma bisa baca)

  private summarySubject = new BehaviorSubject<TransactionSummary>({
    totalBalance: 0,
    totalTransactions: 0,
    totalFailed: 0,
    totalPending: 0
  });
  summary$ = this.summarySubject.asObservable();

  private issuesSubject = new BehaviorSubject<Transaction[]>([]);
  issues$ = this.issuesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  private pendingTransactionSubject = new BehaviorSubject<Transaction[]>([]);
  pendingTransaction$ = this.pendingTransactionSubject.asObservable();

  private detailTransactionSubject = new BehaviorSubject<Transaction[]>([]);
  detailTransaction$ = this.detailTransactionSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();

  private pageSizeSubject = new BehaviorSubject<number>(5);
  pageSize$ = this.pageSizeSubject.asObservable();

  paginatedTransactions$ = combineLatest([
    this.transactions$,
    this.currentPage$,
    this.pageSize$
  ]).pipe(
    map(([transactions, currentPage, pageSize]) => {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      return transactions.slice(start, end);
    })
  );

  setPage(page: number) {
    this.currentPageSubject.next(page);
  }

  setPageSize(size: number) {
    this.pageSizeSubject.next(size);
    this.currentPageSubject.next(1); // reset page
  }

  totalPages$ = combineLatest([
    this.transactions$,
    this.pageSize$
  ]).pipe(
    map(([transactions, pageSize]) => {
      const total = Math.ceil(transactions.length / pageSize);
      return total > 0 ? total : 1;
    })
  );

  getAllTransactions(): Observable<any> {
    return forkJoin({
      transactions: this.http.get(API_URL_GET_TRANSACTION),
      issues: this.http.get(API_URL_GET_ISSUE)
    }).pipe(//dikasih pipe agar hasil dari hit endpoint bisa dimodifikasi (Minimal disimpen aja).
      tap((res: any) => {
        const transactionData = res.transactions?.Data?.transactions || {};
        const balanceData = res.transactions?.Data?.total_balance || {};
        const issueData = res.issues?.Data?.issues || [];
        const pendingTransactionData = issueData?.filter((i: any) => i.status === 'PENDING')

        this.transactionsSubject.next(transactionData); //cara update data + ngasih tau semua subscriber kalau datanya berubah. mirip update state (mirip setState)
        this.issuesSubject.next(issueData)
        this.pendingTransactionSubject.next(pendingTransactionData);

        const summary: TransactionSummary = {
          totalTransactions: transactionData?.length || 0,
          totalBalance: JSON.stringify(balanceData) === '{}' ? 0 : balanceData,
          totalFailed: issueData?.filter((i: any) => i.status === 'FAILED')?.length,
          totalPending: pendingTransactionData?.length
        };

        this.summarySubject.next(summary); //cara update data + ngasih tau semua subscriber kalau datanya berubah. mirip update state (mirip setState)
      })
    )
  }

  getDetailTransactions(id: number): Observable<any> {
    return this.http.get(`${API_URL_DETAIL_TRANSACTION}/${id}`).pipe(
      map((res: any) => res?.Data || {})
    );
  }

  //Karena HttpClient di Angular memang mengembalikan Observable. Karena fungsi yang return async result, Observable dipakai untuk handle async flow (HTTP request)
  uploadTransactionCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    // Start loading (success)
    this.loadingSubject.next(true);

    return this.http.post(API_URL_UPLOAD_TRANSACTION, formData).pipe(
      switchMap(() => this.getAllTransactions()),
      catchError((err) => {
        console.error('❌ ERROR:', err);
        this.errorSubject.next('Upload failed. Please try again.');
        return throwError(() => err?.error?.Message);
      }),
      // Stop loading (success)
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }


  markTransactionAsSuccess(id: number): Observable<any> {
    return this.http.put(`${API_URL_EDIT_TRANSACTION_SUCCESS}/${id}/success`, {}).pipe(
      switchMap(() => this.getAllTransactions()),
      catchError((err) => {
        console.error('failed to update transaction status to success:', err);
        return throwError(() => err);
      })
    );
  }
}

