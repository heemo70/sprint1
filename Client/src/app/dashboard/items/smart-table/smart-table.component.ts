import { Component } from '@angular/core';
import { ProductService } from '../../../product.service';
import { UserService } from '../../../user.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class SmartTableComponent {

  settings = {
    noDataMessage: this.message(),
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    add: {
      addButtonContent: '<i class="nb-plus" ></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>'
    },
    columns: {
      id: {
        title: 'ID #',
        type: 'number',
        editable: false
      },
      name: {
        title: 'Product Name',
        type: 'string',
      },
      price: {
        title: 'Price',
        type: 'number',
        valuePrepareFunction: (price) => {
          var formatted = this.curpipe.transform(price,'USD');
          return formatted;
        }
      },
      createdAt: {
        title: 'Created At',
        type: 'date',
        editable: false,
        valuePrepareFunction: (date) => { 
          var raw = new Date(date);
  
          var formatted = this.datepipe.transform(raw, 'dd MMM yyyy');
          return formatted; 
        }
      },
      updatedAt: {
        title: 'Last Updated At',
        type: 'date',
        editable: false,
        valuePrepareFunction: (date) => { 
          var raw = new Date(date);
  
          var formatted = this.datepipe.transform(raw, 'dd MMM yyyy');
          return formatted; 
        }
      },
      sellerName: {
        title: 'Seller Name',
        type: 'string',
      },
      stock: {
        title: 'Amount in stock',
        type: 'number'
      }
    },
  };

  source: LocalDataSource;

  constructor(private productService: ProductService,
              private userService: UserService,
              private router: Router,
              private datepipe : DatePipe,
              private curpipe: CurrencyPipe) {
    this.source = new LocalDataSource();
    this.getProducts();
  }

  message(): String {
    return 'No Products in the Data Base sold by the component.';
  }

  getProducts() {
    var self = this;
    this.productService.getProducts().subscribe(function (res) {
      if (res.msg === 'Products retrieved successfully.'){
        var Prods: any[] = res.data;
        var mine: any[] = [];
        for(var i = 0; i < Prods.length; i++){
          Prods[i].createdAt = new Date(Prods[i].createdAt);
          Prods[i].updatedAt = new Date(Prods[i].updatedAt);
          var name = Prods[i].sellerName;
          if(name === 'Ahmed Darwish' || name === 'Omar Hesham' || name === 'Nadine Hany' || name === 'Ibrahim Ali' || name === 'Salma Ghoneim')
            mine.push(Prods[i]);
        }
        self.source.load(mine);
      }
    });
  }
}
