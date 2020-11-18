import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { createTextMaskInputElement } from 'text-mask-core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import {GroceryItem} from '../../helperClasses/GroceryItem';
import { AlertController } from 'ionic-angular';
import { GroceriesProvider } from '../../providers/groceries/groceries';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-grocery',
  templateUrl: 'grocery-list.html'
})
export class GroceryPage {
  name:string;
  quantity:number;
  price: string;
  items: GroceryItem[] =[];
  testItem = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              public groceriesSerivce: GroceriesProvider,  private fb: FormBuilder,
              private socialSharing: SocialSharing) {
              groceriesSerivce.dataChanged.subscribe((dataChanged: boolean) =>{
                this.LoadItems()
              });
  }

  ionViewDidLoad(){
    this.LoadItems()
  }

  @ViewChild('priceInput') 
  public set priceInput(value: HTMLInputElement) {
    if (!value) {
      return;
    }
    this.registerTextMask(value);
  }

  LoadItems(){
    //return this.groceriesSerivce.getItems()
    this.groceriesSerivce.getItemsServer()
      .subscribe(
        items => this.testItem = items,
        error => this.errorMessage = <any> error
      )
  }

  getItems(){
    return this.testItem
  }

  AddItem(){
    if ( this.name === '' || this.name === undefined){
      alert('Please enter a valid grocery item');
    } else if (this.price === undefined){
      alert('Price is invalid. Please input a valid number');
    }else if (isNaN(this.quantity) || this.quantity == 0){
      alert('Quantity is invalid. Please input a valid number');
    } else{
      var groceryObject =  new GroceryItem(
         this.name, 
         this.quantity, 
         this.price
      );

      var item = {
        name: this.name, 
        quantity: this.quantity, 
        price: this.price
      }
      // this.groceriesSerivce.addItem(groceryObject);
      this.groceriesSerivce.addItemServer(item)
      this.name = "";
      this.quantity = 0;
      this.price = "";
    }
  }

  deleteItem(item, idx){
    // this.groceriesSerivce.removeItem(idx)
    this.groceriesSerivce.removeItemById(item._id)
    alert(`item ${item.name} deleted from the shopping list`);
  }

  modifyItem(item, idx){
    this.showPrompt(item, idx);
  }

  shareItem(item, idx){
    let itemIdx = idx + 1
    let message = `${itemIdx} - ${item.name} - Quantity: ${item.quantity} - Price: ${item.price}`
    this.socialSharing.share(message, "Sharing Items").then(() => {
      console.log(`successfully share ${item.name}`)
    }).catch(() => {
      alert(`Unable to share item ${item.name}`)
    });
  }

  showPrompt(item, idx) {
    const prompt = this.alertCtrl.create({
      title: `Edit: ${item.name}`,
      message: `Please edit the properties for ${item.name}`,
      inputs: [
        {
          name: 'id', 
          value: item._id,
          disabled: true, 
          label: 'Item Id'
        },
        {
          name: 'name',
          value: item.name, 
          disabled: true, 
          label: "Name"
        },
        {
          name: 'price',
          placeholder: `${item.price}`,
          value: item.price , 
          label: "Price"
        },
        {
          label: 'Quantity',
          name: 'quantity',
          placeholder: `${item.quantity}`,
          value: item.quantity
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: newItem => {
            // this.groceriesSerivce.editItem(newItem, idx)
            console.log(newItem)
            this.groceriesSerivce.editItemByItem(newItem);
          }
        }
      ]
    });
    prompt.present();
  }

  get priceForm() {
    return this.form.get('priceForm') as FormControl;
  }

  // form validator for masking
  public form: FormGroup = this.fb.group({
    priceForm: [null, [Validators.required]],
  });

  // mask the input to behave like currency
  private registerTextMask(inputElement: HTMLInputElement) {
    const numberMask = createNumberMask({
      prefix: '$ ',
      allowDecimal: true
    })

    const maskedInput = createTextMaskInputElement({
      inputElement,
      mask: numberMask,
      guide: false,
    });
    
    this.priceForm.valueChanges.subscribe(value => {
      maskedInput.update(value);
    });
  }

}
