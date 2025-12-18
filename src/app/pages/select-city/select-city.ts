import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { City } from '../../models/city/city';
import { CityService } from '../../services/city/city.service';
import { ConsumerService } from '../../services/consumer/consumer.service';


@Component({
    selector: 'app-select-city',
    imports: [CommonModule, RouterModule, NzSelectModule, NzButtonModule, FormsModule],
    templateUrl: './select-city.html',
    styleUrl: './select-city.scss',
})
export class SelectCity implements OnInit {
    cities: City[] = [];
    selectedCityId: number | null = null;

    loadingCities = false;
    saving = false;

    constructor(
        private cityService: CityService,
        private consumerService: ConsumerService,
        private notification: NzNotificationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchCities();
    }

    fetchCities(): void {
        this.loadingCities = true;
        this.cityService.getActiveCities().subscribe({
            next: (cities) => {
                this.cities = cities || [];
                this.loadingCities = false;
            },
            error: (err) => {
                this.loadingCities = false;
                this.notification.create(
                    'error',
                    'Erro ao carregar cidades',
                    'Não foi possível carregar a lista de cidades. Tente novamente mais tarde.'
                );
            }
        });
    }

    save(): void {
        if (!this.selectedCityId) return;
        this.saving = true;
        this.consumerService.saveSelectedCity(this.selectedCityId).subscribe({
            next: () => {
                this.saving = false;
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.saving = false;
                if (err?.status === 400) {
                    this.notification.create('error', 'Cidade inválida', 'A cidade selecionada não é válida.');
                } else {
                    this.notification.create('error', 'Erro ao salvar cidade', 'Ocorreu um erro ao salvar sua cidade. Tente novamente mais tarde.');
                }
            }
        });
    }
}
