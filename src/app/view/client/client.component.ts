import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../service/client.service';
import { Client } from '../../interfaces/client.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  paginatedClients: Client[] = [];
  newClient: Client = { id: 0, name: '', address: '', phone: '', email: '' };
  editClient: Client | null = null;

  currentPage: number = 1;
  clientsPerPage: number = 10;
  totalPages: number = 1;
  searchTerm: string = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClientss();
    this.applyFilters();
  }

  loadClientss(): void {
    this.clients = [
      { id: 1, name: 'John Doe', address: '123 Main St, City A', phone: '(123) 456-7890', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', address: '456 Oak St, City B', phone: '(234) 567-8901', email: 'jane@example.com' },
      { id: 3, name: 'Alice Johnson', address: '789 Pine St, City C', phone: '(345) 678-9012', email: 'alice@example.com' },
      { id: 4, name: 'Michael Brown', address: '101 Maple St, City D', phone: '(456) 789-0123', email: 'michael@example.com' },
      { id: 5, name: 'Emma Wilson', address: '202 Birch St, City E', phone: '(567) 890-1234', email: 'emma@example.com' },
      { id: 6, name: 'David Clark', address: '303 Cedar St, City F', phone: '(678) 901-2345', email: 'david@example.com' },
      { id: 7, name: 'Olivia Lewis', address: '404 Elm St, City G', phone: '(789) 012-3456', email: 'olivia@example.com' },
      { id: 8, name: 'James Walker', address: '505 Fir St, City H', phone: '(890) 123-4567', email: 'james@example.com' },
      { id: 9, name: 'Sophia Harris', address: '606 Spruce St, City I', phone: '(901) 234-5678', email: 'sophia@example.com' },
      { id: 10, name: 'Liam Robinson', address: '707 Aspen St, City J', phone: '(012) 345-6789', email: 'liam@example.com' },
      { id: 11, name: 'Isabella Martinez', address: '808 Willow St, City K', phone: '(123) 456-7890', email: 'isabella@example.com' },
      { id: 12, name: 'Ethan Anderson', address: '909 Redwood St, City L', phone: '(234) 567-8901', email: 'ethan@example.com' },
      { id: 13, name: 'Mia Garcia', address: '1010 Poplar St, City M', phone: '(345) 678-9012', email: 'mia@example.com' },
      { id: 14, name: 'Lucas Rodriguez', address: '1111 Cypress St, City N', phone: '(456) 789-0123', email: 'lucas@example.com' },
      { id: 15, name: 'Amelia Lee', address: '1212 Palm St, City O', phone: '(567) 890-1234', email: 'amelia@example.com' },
      { id: 16, name: 'Oliver Kim', address: '1313 Oak St, City P', phone: '(678) 901-2345', email: 'oliver@example.com' },
      { id: 17, name: 'Charlotte Clark', address: '1414 Cedar St, City Q', phone: '(789) 012-3456', email: 'charlotte@example.com' },
      { id: 18, name: 'Benjamin Lewis', address: '1515 Pine St, City R', phone: '(890) 123-4567', email: 'benjamin@example.com' },
      { id: 19, name: 'Ella Walker', address: '1616 Maple St, City S', phone: '(901) 234-5678', email: 'ella@example.com' },
      { id: 20, name: 'Henry Harris', address: '1717 Birch St, City T', phone: '(012) 345-6789', email: 'henry@example.com' },
    ];
    this.filteredClients = [...this.clients];
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredClients.length / this.clientsPerPage);
    this.setPage(1);
  }

  setPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    const startIndex = (this.currentPage - 1) * this.clientsPerPage;
    const endIndex = startIndex + this.clientsPerPage;
    this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
  }

  applyFilters(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.updatePagination();
  }

  sortByName(order: 'asc' | 'desc'): void {
    // Sort the original list of clients
    this.clients.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return order === 'asc' ? -1 : 1;
      if (nameA > nameB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    // Apply filters to get a consistent paginated view
    this.applyFilters();
  }

  addClient(): void {
    if (this.newClient.name && this.newClient.address && this.newClient.phone) {
      this.clientService.addClient(this.newClient).subscribe((client: Client) => {
        this.clients.push(client);
        this.newClient = { id: 0, name: '', address: '', phone: '', email: '' };
        this.applyFilters();
      });
    }
  }

  addNewClient(): void {
    // Lógica para adicionar um novo cliente
    console.log("New Client button clicked");
    // Aqui você pode abrir um modal ou redirecionar para uma página de criação de cliente
  }
  

  deleteClient(id: number): void {
    this.clientService.deleteClient(id).subscribe(() => {
      this.clients = this.clients.filter(client => client.id !== id);
      this.applyFilters();
    });
  }

  edit(client: Client): void {
    this.editClient = { ...client };
  }

  updateClient(): void {
    if (this.editClient) {
      this.clientService.updateClient(this.editClient).subscribe((updatedClient: Client) => {
        const index = this.clients.findIndex(client => client.id === updatedClient.id);
        if (index !== -1) {
          this.clients[index] = updatedClient;
        }
        this.editClient = null;
        this.applyFilters();
      });
    }
  }

  cancelEdit(): void {
    this.editClient = null;
  }
}
