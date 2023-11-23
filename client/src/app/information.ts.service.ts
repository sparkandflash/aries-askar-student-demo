import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InformationTsService {

  constructor() { }
  product = [{

    firstname: "ram",
    lastname: "das",
    year: "2022",
    marks: [{
      mathematics: "77",
      science: "95",
      social: "86"
    }]
  },
  {
    firstname: "deepak",
    lastname: "kumar",
    year: "2022",
    marks: [{
      mathematics: "55",
      science: "85",
      social: "75"
    }]
  },
  {
    firstname: "sudheer",
    lastname: "naik",
    year: "2022",
    marks: [{
      mathematics: "76",
      science: "92",
      social: "54"
    }]
  }]
}
