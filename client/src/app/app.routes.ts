import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { NgModule } from '@angular/core';
import { MarksCardComponent } from './marks-card/marks-card.component';

export const routes: Routes = [
    {path:'',component:StudentComponent},
    {path:'student1',component:StudentInfoComponent},
    {path:'markscard',component:MarksCardComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    
  })
  export class AppRoutingModule {}