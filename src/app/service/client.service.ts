// client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../interfaces/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://seu-backend-api-url.com/api/clients'; // URL da API

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}`);
  }
  
  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }
  
  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client);
  }
  
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}  
