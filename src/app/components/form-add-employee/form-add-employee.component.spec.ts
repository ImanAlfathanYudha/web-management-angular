import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddEmployee } from './form-add-employee.component';

describe('FormAddEmployee', () => {
  let component: FormAddEmployee;
  let fixture: ComponentFixture<FormAddEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAddEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
