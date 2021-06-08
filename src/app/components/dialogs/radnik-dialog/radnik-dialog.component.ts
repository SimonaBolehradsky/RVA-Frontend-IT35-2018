import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Obrazovanje } from 'src/app/models/obrazovanje';
import { Radnik } from 'src/app/models/radnik';
import { ObrazovanjeService } from 'src/app/services/obrazovanje.service';
import { RadnikService } from 'src/app/services/radnik.service';


@Component({
  selector: 'app-radnik-dialog',
  templateUrl: './radnik-dialog.component.html',
  styleUrls: ['./radnik-dialog.component.css']
})
export class RadnikDialogComponent implements OnInit, OnDestroy {

  public flag: number;
  obrazovanja: Obrazovanje[];
  obrazovanjeSubscription: Subscription;

  constructor(public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RadnikDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Radnik,
    public radnikService: RadnikService,
    public obrazovanjeService: ObrazovanjeService) { }


  ngOnDestroy(): void {
    this.obrazovanjeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.obrazovanjeSubscription=this.obrazovanjeService.getAllObrazovanjes().subscribe(
      data => {
        this.obrazovanja = data;

      }
    ),
    (error: Error) => {
      console.log(error.name + ' ' + error.message);
    }
  }

  compareTo(a, b) {
    return a.id == b.id;
  }

  public addRadnik(): void {
    this.radnikService.addRadnik(this.data).subscribe(() => {
      this.snackBar.open('Uspesno dodat radnik: ' + this.data.ime+' '+this.data.prezime, 'OK', { duration: 2500 })
    }),
      (error: Error) => {
        console.log(console.error.name + ' ' + error.message);
        this.snackBar.open('Doslo je do greske prilikom dodavanja novog radnika: ', 'Zatvori', { duration: 2500 })

      }
  }

  public updateRadnik(): void {
    this.radnikService.updateRadnik(this.data).subscribe(() => {
      this.snackBar.open('Uspesno modifikovan radnik: ' + this.data.ime+' '+this.data.prezime, 'OK', { duration: 2500 })
    }),
      (error: Error) => {
        console.log(console.error.name + ' ' + error.message);
        this.snackBar.open('Doslo je do greske prilikom modifikacije postojeceg radnika: ', 'Zatvori', { duration: 2500 })

      }
  }


  public deleteRadnik(): void {
    this.radnikService.deleteRadnik(this.data.id).subscribe(() => {
      this.snackBar.open('Uspesno obrisan radnik: ' + this.data.ime+' '+this.data.prezime, 'OK', { duration: 2500 })
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
