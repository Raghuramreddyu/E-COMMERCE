import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CartItem } from './cart.service';

// --- DEFINE THE SHAPE OF THE ORDER DATA ---
// This defines what a single item within a past order looks like.
export interface OrderItem {
  quantity: number;
  price_at_purchase: number;
  name: string;
  image_url: string;
}

// This defines what a single order in the history looks like.
export interface Order {
  id: number;
  public_order_id: string;
  created_at: string; // This will be a date string from the database
  total_amount: number;
  items: OrderItem[]; // Each order contains an array of items
}
// -----------------------------------------

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * --- THIS IS THE NEW METHOD ---
   * Fetches the order history for the currently logged-in user.
   * @returns An Observable array of Orders.
   */
  getOrders(): Observable<Order[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // Makes a GET request to /api/orders
    return this.http.get<Order[]>(this.apiUrl, { headers: headers });
  }

  getOrder(publicOrderId: string): Observable<Order> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Order>(`${this.apiUrl}/${publicOrderId}`, { headers: headers });
  }

  /**
   * Places a new order by sending the cart items to the backend.
   * (This is your existing method).
   * @param items The array of CartItem objects from the shopping cart.
   * @returns An Observable with the response from the server.
   */
  placeOrder(items: CartItem[]): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body = { items: items };

    // Makes a POST request to /api/orders
    return this.http.post(this.apiUrl, body, { headers: headers });
  }
}

