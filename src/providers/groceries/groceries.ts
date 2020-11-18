import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GroceryItem } from '../../helperClasses/GroceryItem';
import {map, catchError } from 'rxjs/operators';
import {Subject} from 'rxjs';

/*
  Generated class for the GroceriesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceriesProvider {
  
  groceryItems = [] as GroceryItem[]
  items : any = []
  dataChanged: Observable<boolean>
  private dataChangedSubject: Subject<boolean>

  baseURL = "http://ec2-3-138-110-180.us-east-2.compute.amazonaws.com:8080"

  constructor(public http: HttpClient) {
    console.log('Hello GroceriesProvider Provider');
    this.dataChangedSubject = new Subject<boolean>();
    this.dataChanged = this.dataChangedSubject.asObservable();
  }

  getItemsServer() : Observable<object[]>{
    return this.http.get(this.baseURL + '/api/groceries').pipe(
      map(this.extractData), 
      catchError(this.handleError)
    );
  }

  addItemServer(item){
    console.log(this.baseURL + '/api/groceries/', item)
    this.http.post(this.baseURL + '/api/groceries/', item).subscribe(res=>{
      this.items = res;
      this.dataChangedSubject.next(true)
    });
  }

  private extractData(res: Response){
    let body = res
    return body  || {}
  }

  private handleError(error : Response | any){
    return Observable.throw("Error") 
  }

  getItems(){
    return this.groceryItems
  }

  addItem(item){
    this.groceryItems.push(item)
  }

  removeItem(idx){
    this.groceryItems.splice(idx, 1);
  }

  removeItemById(id){
    this.http.delete(this.baseURL + '/api/groceries/'+id).subscribe(res=>{
      this.items = res;
      this.dataChangedSubject.next(true)
    });
  }

  editItemByItem(item){
    this.http.put(this.baseURL + '/api/groceries/'+item.id, item).subscribe(res=>{
      this.items = res;
      this.dataChangedSubject.next(true)
    });
  }

  editItem(newItem, idx){
    this.groceryItems[idx] = newItem
  }
}
