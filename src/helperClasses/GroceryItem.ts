export class GroceryItem{ 
    name: string; 
    quantity: number;
    price: string;

    constructor(name: string, quantiy: number, price: string){
        this.name = name;
        this.quantity = quantiy;
        this.price = price;
    }
}