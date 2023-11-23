import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InformationTsService } from '../information.ts.service';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})

export class StudentComponent {
  constructor(private router: Router, private Info: InformationTsService) { }
  title = 'student-demo';
  product = this.Info.product;
  person: any = '';
  click(e: any) {
    sessionStorage.setItem('student', JSON.stringify(e));
    this.router.navigate(['/student1']);
  }
}
