import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingTransactionComponent } from './components/pending-transaction/pending-transaction.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormDetailComponent } from './components/form-detail/form-detail.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }, // halaman utama kamu
  { path: 'pending', component: PendingTransactionComponent },
  { path: 'edit/:id', component: FormDetailComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}