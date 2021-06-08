import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Preduzece } from 'src/app/models/preduzece';
import { Sektor } from 'src/app/models/sektor';
import { PreduzeceService } from 'src/app/services/preduzece.service';
import { SektorService } from 'src/app/services/sektor.service';

@Component({
  selector: 'app-sektor-dialog',
  templateUrl: './sektor-dialog.component.html',
  styleUrls: ['./sektor-dialog.component.css']
})
export class SektorDialogComponent implements OnInit {

  public flag: number;
  preduzeca: Preduzece[];
  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SektorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Sektor,
    public sektorService: SektorService,
    public preduzeceService: PreduzeceService) { }

  ngOnInit(): void {
    this.preduzeceService.getAllPreduzeces().subscribe(
      data => {
        this.preduzeca = data;

      }
    );
  }

  compareTo(a, b) {
    return a.id == b.id;
  }

  public addSektor(): void {
    this.sektorService.addSektor(this.data).subscribe(() => {
      this.snackBar.open('Uspesno dodat sektor: ' + this.data.naziv, 'OK', { duration: 2500 })
    }),
      (error: Error) => {
        console.log(console.error.name + ' ' + error.message);
        this.snackBar.open('Doslo je do greske prilikom dodavanja novog sektora: ', 'Zatvori', { duration: 2500 })

      }
  }

  public updateSektor(): void {
    this.sektorService.updateSektor(this.data).subscribe(() => {
      this.snackBar.open('Uspesno modifikovan sektor: ' + this.data.naziv, 'OK', { duration: 2500 })
    }),
      (error: Error) => {
        console.log(console.error.name + ' ' + error.message);
        this.snackBar.open('Doslo je do greske prilikom modifikacije postojeceg sektora: ', 'Zatvori', { duration: 2500 })

      }
  }


  public deleteSektor(): void {
    this.sektorService.deleteSektor(this.data.id).subscribe(() => {
      this.snackBar.open('Uspesno obrisan sektor: ' + this.data.naziv, 'OK', { duration: 2500 })
    }),
      (error: Error) => {
        console.log(console.error.name + ' ' + error.message);
        this.snackBar.open('Doslo je do greske prilikom brisanja sektora: ', 'Zatvori', { duration: 2500 })

      }
  }

  public cancel(): void {
    this.dialogRef.close();
    this.snackBar.open('Odustali ste.', 'Zatvori', { duration: 1000 })
  }


}
