import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InformationTsService } from '../information.ts.service';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-info.component.html',
  styleUrl: './student-info.component.css'
})

export class StudentInfoComponent {
  constructor(private router: Router, private Info: InformationTsService) { }
  person: any;
  ngOnInit() {
    const storedData = sessionStorage.getItem("student");
    if (storedData != null) {
      this.person = JSON.parse(storedData);
    }
  }
  click(e: any) {
    sessionStorage.setItem('studentcard', JSON.stringify(e));
    this.router.navigate(['/student1']);
  }
  show(n: any) {
    sessionStorage.setItem('studentname', JSON.stringify(n));
    this.router.navigate(['/markscard']);
  }

}


