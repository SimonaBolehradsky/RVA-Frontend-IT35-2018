import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Obrazovanje } from 'src/app/models/obrazovanje';
import { Radnik } from 'src/app/models/radnik';
import { Sektor } from 'src/app/models/sektor';
import { RadnikService } from 'src/app/services/radnik.service';
import { RadnikDialogComponent } from '../../dialogs/radnik-dialog/radnik-dialog.component';

@Component({
  selector: 'app-radnik',
  templateUrl: './radnik.component.html',
  styleUrls: ['./radnik.component.css']
})
export class RadnikComponent implements OnInit, OnChanges, OnDestroy  {


  displayedColumns=['id','ime','prezime','brojLk','obrazovanje','sektor','actions'];
  dataSource: MatTableDataSource<Radnik>;
  subscription: Subscription;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @Input() selektovanSektorr:Sektor;

  
  
    constructor(private radnikService:RadnikService,
               private dialog:MatDialog ) { }

  ngOnChanges(changes: SimpleChanges): void {
   if(this.selektovanSektorr.id){
     this.loadData();
   }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    //this.loadData();
  }

  

  public loadData() {
     this.subscription=this.radnikService.getRadnikZaSektor(this.selektovanSektorr.id).subscribe( data => {

      
        this.dataSource=new MatTableDataSource(data);


        this.dataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return key === 'obrazovanje' ? currentTerm + data.obrazovanje.naziv : currentTerm + data[key];
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        this.dataSource.sortingDataAccessor = (data, property) => {
          switch (property) {
            case 'obrazovanje': return data.obrazovanje.naziv.toLocaleLowerCase();
            default: return data[property];
          }
        };

        this.dataSource.sort= this.sort;
        this.paginator._intl.itemsPerPageLabel = 'Broj elemenata po stranici';
        this.dataSource.paginator=this.paginator;
      }
      
    ),
    (error: Error) => {
      console.log(error.name + ' ' + error.message);
    }
  }

  public openDialog(flag:number,id?:number, ime?:string,prezime?:string, brojLk?:number, obrazovanje?:Obrazovanje,sektor?:Sektor ):void{
      const dialogRef= this.dialog.open(RadnikDialogComponent,{data:{id,ime,prezime,brojLk,obrazovanje,sektor}});
  
      dialogRef.componentInstance.flag=flag;
      if(flag==1)
      {
        dialogRef.componentInstance.data.sektor=this.selektovanSektorr;
      }
      dialogRef.afterClosed().subscribe(res => {
        if (res==1)
        {
          this.loadData();
        }
      })
    }

    applyFilter(filterValue:string)
    {
      filterValue=filterValue.trim();
      filterValue=filterValue.toLocaleLowerCase();
      this.dataSource.filter=filterValue;
    }

    

}
