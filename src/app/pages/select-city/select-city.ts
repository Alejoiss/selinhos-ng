import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { filter, take } from 'rxjs';

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
    ) { }

    ngOnInit(): void {
        this.fetchCities();
    }

    fetchCities(): void {
        this.loadingCities = true;
        this.cityService.getActiveCities().subscribe({
            next: (cities) => {
                this.cities = cities || [];
                this.loadingCities = false;

                if (this.cities.length === 1) {
                    this.selectedCityId = this.cities[0].id;
                    this.save();
                }
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

    compareCities = (o1: any, o2: any): boolean => {
        return o1 == o2; // usa == pra comparar valor, não tipo
    };

    save(): void {
        if (!this.selectedCityId) return;
        this.saving = true;
        this.consumerService.saveSelectedCity(this.selectedCityId).subscribe({
            next: () => {
                this.saving = false;
                this.router.navigate(['/home']);
                this.consumerService.getLoggedUser().pipe(filter(consumer => !!consumer), take(1)).subscribe(
                    (consumer) => {
                        if (!consumer) return;
                        consumer.selected_city = this.cities.find(c => c.id === this.selectedCityId) || new City();
                        this.consumerService.setLoggedUser(consumer);
                    }
                );
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
