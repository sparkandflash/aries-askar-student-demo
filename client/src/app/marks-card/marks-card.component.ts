import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentInfoComponent } from '../student-info/student-info.component';
import { InformationTsService } from '../information.ts.service';

@Component({
  selector: 'app-marks-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marks-card.component.html',
  styleUrl: './marks-card.component.css'
})
export class MarksCardComponent {
  constructor(private router: Router, private Info: InformationTsService) { }
  person: any;
  Inform: any;
  name: any;
  ngOnInit() {
    const storedData = sessionStorage.getItem("studentcard");
    const stuname = sessionStorage.getItem("studentname");
    if (storedData != null) {
      this.Inform = JSON.parse(storedData);
    }
    if (stuname != null) {
      this.name = JSON.parse(stuname);
    }
    if (this.Inform != null) {
      if (this.Inform.firstname == this.name) {
        this.person = this.Inform;
      }
      else {
        this.person == null;
      }
    }
  }
}
